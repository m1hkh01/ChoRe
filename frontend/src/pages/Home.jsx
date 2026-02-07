import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "@/api";
import "@/assets/Home.css";
import PostGrid from "@/components/Post/PostGrid";
import { useAuthStore } from "@/store/auth";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

function Home() {
  const { user } = useAuthStore();

  const [posts, setPosts] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [postCates, setPostCates] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [maxPriceInDB, setMaxPriceInDB] = useState(0);

  const [filters, setFilters] = useState({
    keyword: "",
    brandId: null,
    categoryId: null,
    priceRange: [0, 0],
    time: null,
    address: null
  });

  // 👉 LẤY POSTS PHÙ HỢP VỚI FILTER HIỆN TẠI (CORE LOGIC)
  const getFilteredPostsForRelation = () => {
    let filtered = allPosts;

    const categoryId = filters.categoryId ? Number(filters.categoryId) : null;
    const brandId = filters.brandId ? Number(filters.brandId) : null;

    if (categoryId) {
      const postIdsInCategory = postCates
        .filter(pc => (pc.cateId || pc.CateId) === categoryId)
        .map(pc => pc.postId || pc.PostId);

      filtered = filtered.filter(p =>
        postIdsInCategory.includes(p.postId || p.PostId)
      );
    }

    if (brandId) {
      filtered = filtered.filter(
        p => (p.brandId || p.BrandId) === brandId
      );
    }

    return filtered;
  };

  // 👉 HÀM TÍNH CÁC BRAND KHẢ DỤNG - DỰA TRÊN CATEGORY ĐÃ CHỌN
  const getAvailableBrands = () => {
    // ⛔ CHƯA LOAD XONG DATA → KHÔNG DISABLE GÌ HẾT
    if (!postCates.length || !allPosts.length) {
      return brands.map(b => ({ ...b, isDisabled: false }));
    }

    const filteredPosts = getFilteredPostsForRelation();

    const validBrandIds = [...new Set(
      filteredPosts.map(p => p.brandId || p.BrandId)
    )];

    return brands.map(brand => {
      const brandId = brand.brandId || brand.BrandId;
      return {
        ...brand,
        isDisabled:
          filters.categoryId !== null &&
          !validBrandIds.includes(brandId)
      };
    });
  };


  // 👉 HÀM TÍNH CÁC CATEGORY KHẢ DỤNG - DỰA TRÊN BRAND ĐÃ CHỌN
  const getAvailableCategories = () => {
    if (!postCates.length || !allPosts.length) {
      return categories.map(c => ({ ...c, isDisabled: false }));
    }

    const filteredPosts = getFilteredPostsForRelation();
    const validPostIds = filteredPosts.map(p => p.postId || p.PostId);

    const validCategoryIds = [...new Set(
      postCates
        .filter(pc =>
          validPostIds.includes(pc.postId || pc.PostId)
        )
        .map(pc => pc.cateId || pc.CateId)
    )];

    return categories.map(category => {
      const cateId = category.cateId || category.CateId;
      return {
        ...category,
        isDisabled:
          filters.brandId !== null &&
          !validCategoryIds.includes(cateId)
      };
    });
  };

  // 👉 LOAD POSTS
  const loadPosts = () => {
    api.get("/api/posts/home", {
      params: {
        keyword: filters.keyword || null,
        brandId: filters.brandId ? Number(filters.brandId) : null,
        categoryId: filters.categoryId ? Number(filters.categoryId) : null,
        minPrice: filters.priceRange[0],
        maxPrice: filters.priceRange[1],
        time: filters.time ? Number(filters.time) : null
      }
    })
      .then(res => {
        setPosts(res.data);

        // ✅ TỰ ĐỘNG TÍNH MAX PRICE TỪ POSTS (chỉ lấy posts có giá)
        if (res.data && res.data.length > 0) {
          const pricesArray = res.data
            .map(p => {
              if (p.priceType === "FIXED" && p.price) return p.price;
              if (p.priceType === "RANGE" && p.maxPrice) return p.maxPrice;
              return 0;
            })
            .filter(price => price > 0);

          if (pricesArray.length > 0) {
            const calculatedMax = Math.max(...pricesArray);

            if (calculatedMax > maxPriceInDB) {
              setMaxPriceInDB(calculatedMax);

              if (filters.priceRange[1] === maxPriceInDB || filters.priceRange[1] === 0) {
                setFilters(prev => ({
                  ...prev,
                  priceRange: [prev.priceRange[0], calculatedMax]
                }));
              }
            }
          }
        }
      })
      .catch(err => console.error("Lỗi load posts:", err));
  };
  // 👉 LOAD DATA BAN ĐẦU
  useEffect(() => {
    api.get("api/brands").then(res => setBrands(res.data));
    api.get("api/categories").then(res => setCategories(res.data));
    api.get("api/postcates").then(res => setPostCates(res.data));

    // ✅ CHỈ LẤY POSTS ĐÃ APPROVED (statusIds=2)
    api.get("/api/posts/all", { params: { statusIds: [2] } })
      .then(res => {
        setAllPosts(res.data);
        setPosts(res.data);

        if (res.data && res.data.length > 0) {
          const pricesArray = res.data
            .map(p => {
              if (p.priceType === "FIXED" && p.price) return p.price;
              if (p.priceType === "RANGE" && p.maxPrice) return p.maxPrice;
              return 0;
            })
            .filter(price => price > 0);

          if (pricesArray.length > 0) {
            const calculatedMax = Math.max(...pricesArray);
            setMaxPriceInDB(calculatedMax);
            setFilters(prev => ({
              ...prev,
              priceRange: [0, calculatedMax]
            }));
          }
        }
      })
      .catch(err => console.error("Lỗi load posts:", err));
      
  }, []);

  // 👉 SET DEFAULT ADDRESS FILTER WHEN USER CHANGES
  // useEffect(() => {
  //   if (user && user.address && !filters.address) {
  //     setFilters(prev => ({
  //       ...prev,
  //       address: user.address
  //     }));
  //   }
  // }, [user?.address]);

  // 👉 AUTO-LOAD KHI FILTER THAY ĐỔI
  useEffect(() => {
    if (maxPriceInDB === 0) return;

    const timer = setTimeout(() => {
      loadPosts();
    }, 500);

    return () => clearTimeout(timer);
  }, [filters, maxPriceInDB, postCates, allPosts]);

  // 👉 LẤY DANH SÁCH ĐÃ LỌC
  const _AvailableBrands = getAvailableBrands();
  const _AvailableCategories = getAvailableCategories();

  // 👉 LẤY DANH SÁCH ĐỊA ĐIỂM TỪ POSTS HIỆN TẠI
  // const _AvailableLocations = getAvailableLocations();

  // 👉 LỌC POSTS THEO PRICE RANGE TRÊN FRONTEND
  // 👉 LỌC POSTS THEO PRICE RANGE TRÊN FRONTEND
  const getFilteredPosts = () => {
    return posts.filter(post => {
      // ✅ XỬ LÝ GIÁ THEO KIỂU
      let priceMatch = true;

      if (post.priceType === "NEGOTIABLE") {
        // Bài thương lượng LUÔN hiển thị (không lọc theo giá)
        priceMatch = true;
      } else if (post.priceType === "FIXED") {
        const price = post.price || 0;
        priceMatch = price >= filters.priceRange[0] && price <= filters.priceRange[1];
      } else if (post.priceType === "RANGE") {
        // Hiển thị nếu có overlap với khoảng giá filter
        const minPrice = post.minPrice || 0;
        const maxPrice = post.maxPrice || 0;
        priceMatch = maxPrice >= filters.priceRange[0] && minPrice <= filters.priceRange[1];
      }

      // 👉 FILTER THEO ADDRESS
      const addressMatch = !filters.address || (post.address || post.Address || "").trim() === filters.address;

      return priceMatch && addressMatch;
    });
  };

  const filteredPosts = getFilteredPosts();

  return (
    <div className="home-wrapper">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        centeredSlides
        loop
        speed={1000}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        navigation
        pagination={{ clickable: true }}
        className="w-[90%] h-[200px] mb-8 mt-2 shadow-[0_0_5px_rgba(0,0,0,0.1)] rounded-lg mx-auto"
      >
        <SwiperSlide>
          <img src="src/Images/banner1.jpg" className="w-full h-full object-cover" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="src/Images/banner2.jpg" className="w-full h-full object-cover" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="src/Images/banner3.jpg" className="w-full h-full object-cover" />
        </SwiperSlide>
      </Swiper>
      <main className="home-main" style={{ marginTop: "80px" }}>
        {/* POSTS */}
        <section>
          {filteredPosts.length === 0 ? (
            <div className="text-center text-muted py-5">
              Không tìm thấy sản phẩm nào phù hợp
            </div>
          ) : (
            <div className="row g-4">
              <div className="cards-panel">
                <h4 className="mb-4 fw-semibold">Tin đăng mới nhất</h4>
                <PostGrid posts={filteredPosts} />
              </div>
            </div>
          )}
        </section>

      </main>
    </div>
  );
}

export default Home;