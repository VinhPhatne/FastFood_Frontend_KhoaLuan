"use client"

import {
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material"
import axios from "axios"
import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import useCart from "../../hook/useCart"
import { getUserProfile } from "../State/Authentication/Action"
import { getChoicesByOptionalId } from "../State/Choice/Action"
import { getOptionals } from "../State/Optional/Action"
import socket from "../config/socket"
import { useCartContext } from "./CartContext"
import { notification } from "antd"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-routing-machine"
import "leaflet-routing-machine/dist/leaflet-routing-machine.css"
import "./index.scss"

// Fix default marker icon issue with Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

// Component để xử lý tính toán tuyến đường và phí giao hàng
const RoutingMachine = ({ destination, setShippingFee }) => {
  const map = useMap()
  const routingControlRef = useRef(null)
  const STORE_LOCATION = {
    lat: 10.850317,
    lng: 106.772936,
  }
  const SHIPPING_RATE_PER_KM = 3000 // 3,000 VND/km

  useEffect(() => {
    if (!destination) return

    // Xóa tuyến đường cũ nếu có
    if (routingControlRef.current) {
      map.removeControl(routingControlRef.current)
    }

    try {
      const routingControl = L.Routing.control({
        waypoints: [L.latLng(STORE_LOCATION.lat, STORE_LOCATION.lng), L.latLng(destination.lat, destination.lng)],
        routeWhileDragging: true,
        showAlternatives: false,
        lineOptions: {
          styles: [{ color: "#ff7d01", weight: 4 }],
        },
        router: L.Routing.osrmv1({
          serviceUrl: "https://router.project-osrm.org/route/v1",
          profile: "driving",
        }),
        createMarker: () => null,
        show: false,
        showPanel: false,
        collapsible: true,
        showAlternatives: false,
        fitSelectedRoutes: true,
      }).addTo(map)

      routingControl.on("routesfound", (e) => {
        const routes = e.routes
        const summary = routes[0].summary
        const distanceInKm = summary.totalDistance / 1000 // Chuyển đổi từ mét sang km
        const roundedDistance = Math.ceil(distanceInKm) // Làm tròn lên
        //const fee = roundedDistance * SHIPPING_RATE_PER_KM // Tính phí giao hàng
        const fee = isNaN(distanceInKm) || !distanceInKm
          ? 0
          : distanceInKm <= 2
          ? 15000
          : 15000 + Math.ceil(distanceInKm - 2) * 4000;

        // Cập nhật phí giao hàng
        setShippingFee(fee)

        // Hiển thị thông báo
        notification.success({
          message: "Đã tính phí giao hàng",
          description: `Khoảng cách: ${roundedDistance} km. Phí giao hàng: ${fee.toLocaleString()} VND`,
          duration: 5,
        })
      })

      routingControl.on("routingerror", (e) => {
        notification.error({
          message: "Lỗi định tuyến",
          description: `Không thể vẽ tuyến đường: ${e.error.message || "Lỗi không xác định"}`,
        })
      })

      routingControl.show()

      routingControlRef.current = routingControl
    } catch (error) {
      notification.error({
        message: "Lỗi bản đồ",
        description: "Không thể vẽ tuyến đường. Vui lòng thử lại.",
      })
    }

    return () => {
      if (routingControlRef.current) {
        map.removeControl(routingControlRef.current)
      }
    }
  }, [map, destination, setShippingFee])

  return null
}

const MapFocusHandler = ({ wardCode, wards, districts, provinces, provinceId, districtId, mapRef }) => {
  const map = useMap()

  useEffect(() => {
    const focusMapOnWard = async () => {
      if (wardCode && wards.length > 0 && districts.length > 0 && provinces.length > 0) {
        const matchedWard = wards.find((ward) => ward.WardCode === wardCode)
        if (matchedWard) {
          const wardName = matchedWard.WardName
          const districtName = districts.find((d) => d.DistrictID === districtId)?.DistrictName || ""
          const provinceName = provinces.find((p) => p.ProvinceID === provinceId)?.ProvinceName || ""

          try {
            const query = `${wardName}, ${districtName}, ${provinceName}, Vietnam`
            const response = await axios.get(
              `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(query)}&countrycodes=VN&addressdetails=1&bounded=1&viewbox=106.4,10.3,107.0,11.2`
            )
            if (response.data && response.data.length > 0) {
              const { lat, lon } = response.data[0]
              map.setView([parseFloat(lat), parseFloat(lon)], 16) // Zoom level 16 để tập trung vào khu vực phường/xã
            } else {
              notification.warning({
                message: "Không tìm thấy tọa độ phường/xã",
                description: "Vui lòng nhấp vào bản đồ để chọn vị trí chính xác.",
              })
              map.setView([10.850317, 106.772936], 14) // Default to store location
            }
          } catch (error) {
            notification.error({
              message: "Lỗi tìm kiếm tọa độ",
              description: "Không thể lấy tọa độ phường/xã. Vui lòng thử lại.",
            })
            map.setView([10.850317, 106.772936], 14) // Default to store location
          }
        }
      }
    }

    focusMapOnWard()
  }, [wardCode, wards, districts, provinces, provinceId, districtId, map])

  return null
}


const Checkout = () => {
  const jwt = localStorage.getItem("jwt")
  const { cart, totalQuantity, totalPrice, handleRemove } = useCart(jwt)
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    phone: "",
    note: "",
    provinceId: "",
    districtId: "",
    wardCode: "",
  })
  const [paymentMethod, setPaymentMethod] = useState("cod")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { clearCart } = useCartContext()
  const { state } = useLocation()

  const {
    discount,
    voucherId,
    finalTotal: initialFinalTotal,
    pointsUsed,
  } = state || JSON.parse(localStorage.getItem("checkoutData")) || {}

  const [provinces, setProvinces] = useState([])
  const [districts, setDistricts] = useState([])
  const [wards, setWards] = useState([])
  const [shippingFee, setShippingFee] = useState(0)
  const [availableServices, setAvailableServices] = useState([])
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [isCalculatingFee, setIsCalculatingFee] = useState(false)
  const mapRef = useRef(null)

  const GHN_API_TOKEN = "2d698e94-2c17-11f0-a0cd-12f647571c0a"
  const GHN_SHOP_ID = "5767786"
  const GHN_API_BASE_URL = "https://online-gateway.ghn.vn"
  const STORE_LOCATION = {
    districtId: 1452,
    wardCode: "21012",
    lat: 10.850317,
    lng: 106.772936,
  }

  useEffect(() => {
    if (state) {
      localStorage.setItem("checkoutData", JSON.stringify(state))
    }
  }, [state])

  const userProfile = useSelector((state) => state.auth.user)
  const { optionals } = useSelector((state) => state.optionalReducer.optionals)
  const [choices, setChoices] = useState({})

  useEffect(() => {
    dispatch(getUserProfile())
    dispatch(getOptionals({ jwt }))
    if (!GHN_API_TOKEN || GHN_API_TOKEN === "your-ghn-api-token-here") {
      notification.error({
        message: "Lỗi cấu hình",
        description: "Vui lòng cập nhật GHN_API_TOKEN hợp lệ trong mã nguồn",
      })
    } else if (!GHN_SHOP_ID || GHN_SHOP_ID === "your-shop-id-here") {
      notification.error({
        message: "Lỗi cấu hình",
        description: "Vui lòng cập nhật GHN_SHOP_ID hợp lệ trong mã nguồn",
      })
    } else {
      fetchProvinces()
    }
  }, [dispatch])

  // Lấy danh sách tỉnh/thành phố từ GHN
  const fetchProvinces = async () => {
    try {
      const response = await axios.get(`${GHN_API_BASE_URL}/shiip/public-api/master-data/province`, {
        headers: { Token: GHN_API_TOKEN, "Content-Type": "application/json" },
      })
      if (response.data.code === 200) {
        setProvinces(response.data.data)
      } else {
        throw new Error(response.data.message || "Lỗi khi lấy danh sách tỉnh/thành phố")
      }
    } catch (error) {
      notification.error({
        message: "Không thể tải danh sách tỉnh/thành phố",
        description: error.response?.data?.message || "Vui lòng kiểm tra token API hoặc kết nối mạng",
      })
    }
  }

  // Lấy danh sách quận/huyện từ GHN dựa trên tỉnh/thành phố đã chọn
  const fetchDistricts = async (provinceId) => {
    try {
      const response = await axios.get(`${GHN_API_BASE_URL}/shiip/public-api/master-data/district`, {
        headers: { Token: GHN_API_TOKEN, "Content-Type": "application/json" },
        params: { province_id: Number.parseInt(provinceId) },
      })
      if (response.data.code === 200) {
        setDistricts(response.data.data)
        return response.data.data
      } else {
        throw new Error(response.data.message || "Lỗi khi lấy danh sách quận/huyện")
      }
    } catch (error) {
      notification.error({
        message: "Không thể tải danh sách quận/huyện",
        description: error.response?.data?.message || "Vui lòng kiểm tra token API hoặc kết nối mạng",
      })
      return []
    }
  }

  // Lấy danh sách phường/xã dựa trên quận/huyện đã chọn
  const fetchWards = async (districtId) => {
    try {
      const response = await axios.get(`${GHN_API_BASE_URL}/shiip/public-api/master-data/ward`, {
        headers: { Token: GHN_API_TOKEN, "Content-Type": "application/json" },
        params: { district_id: Number.parseInt(districtId) },
      })
      if (response.data.code === 200) {
        setWards(response.data.data)
        return response.data.data
      } else {
        throw new Error(response.data.message || "Lỗi khi lấy danh sách phường/xã")
      }
    } catch (error) {
      notification.error({
        message: "Không thể tải danh sách phường/xã",
        description: error.response?.data?.message || "Vui lòng kiểm tra token API",
      })
      return []
    }
  }

  // Lấy danh sách dịch vụ vận chuyển khả dụng
  const fetchAvailableServices = async () => {
    if (!formData.districtId || isNaN(Number.parseInt(formData.districtId))) {
      console.warn("districtId không hợp lệ:", formData.districtId)
      return
    }

    try {
      console.log("Gọi fetchAvailableServices với districtId:", formData.districtId)
      const response = await axios.post(
        `${GHN_API_BASE_URL}/shiip/public-api/v2/shipping-order/available-services`,
        {
          shop_id: Number.parseInt(GHN_SHOP_ID),
          from_district: STORE_LOCATION.districtId,
          to_district: Number.parseInt(formData.districtId),
        },
        { headers: { Token: GHN_API_TOKEN, "Content-Type": "application/json" } },
      )
      if (response.data.code === 200) {
        console.log("Available services:", response.data.data)
        setAvailableServices(response.data.data)
      } else {
        throw new Error(response.data.message || "Lỗi khi lấy dịch vụ vận chuyển")
      }
    } catch (error) {
      console.error("Lỗi khi lấy dịch vụ vận chuyển:", error.response?.data || error.message)
      notification.error({
        message: "Không thể tải danh sách dịch vụ",
        description: error.response?.data?.message || "Vui lòng kiểm tra token API hoặc Shop ID",
      })
    }
  }

  // Hàm tạo mảng các tên tỉnh/thành phố có thể từ dữ liệu địa chỉ
  const getProvinceNames = (addressComponents) => {
    const possibleNames = []

    if (addressComponents.state) possibleNames.push(addressComponents.state)
    if (addressComponents.region) possibleNames.push(addressComponents.region)
    if (addressComponents.province) possibleNames.push(addressComponents.province)

    const provinceMapping = {
      "Ho Chi Minh": ["Hồ Chí Minh", "TP Hồ Chí Minh", "Thành phố Hồ Chí Minh", "TP.HCM", "TPHCM", "Saigon", "Sài Gòn"],
      "Ha Noi": ["Hà Nội", "Hanoi", "TP Hà Nội", "Thành phố Hà Nội"],
      "Da Nang": ["Đà Nẵng", "TP Đà Nẵng", "Thành phố Đà Nẵng"],
    }

    for (const name of [...possibleNames]) {
      if (provinceMapping[name]) {
        possibleNames.push(...provinceMapping[name])
      }
    }

    const prefixes = ["Tỉnh ", "Thành phố ", "TP "]
    const basenames = [...possibleNames]

    for (const name of basenames) {
      if (!name) continue

      for (const prefix of prefixes) {
        if (name.startsWith(prefix) && prefix !== "") {
          possibleNames.push(name.substring(prefix.length))
        } else if (prefix !== "") {
          possibleNames.push(prefix + name)
        }
      }
    }

    if (!possibleNames.includes("Hồ Chí Minh")) {
      possibleNames.push("Hồ Chí Minh", "TP Hồ Chí Minh", "Thành phố Hồ Chí Minh", "TP.HCM", "TPHCM")
    }

    return [...new Set(possibleNames)].filter((name) => name && name.trim() !== "")
  }

  // Hàm tạo mảng các tên quận/huyện có thể từ dữ liệu địa chỉ
  const getDistrictNames = (addressComponents) => {
    const possibleNames = []

    // Thêm các giá trị có thể từ addressComponents
    if (addressComponents.suburb) possibleNames.push(addressComponents.suburb)
    if (addressComponents.city_district) possibleNames.push(addressComponents.city_district)
    if (addressComponents.city) possibleNames.push(addressComponents.city)
    if (addressComponents.county) possibleNames.push(addressComponents.county)
    if (addressComponents.state_district) possibleNames.push(addressComponents.state_district)

    // Thêm các biến thể có thể có
    const districtMapping = {
      "Thủ Đức": ["Thành phố Thủ Đức", "Thu Duc City", "Thủ Đức City"],
      "Ho Chi Minh City": ["Thành phố Thủ Đức"],
      "District 1": ["Quận 1"],
      "Quận 1": ["District 1", "Bến Nghé"],
      "Bến Nghé": ["Quận 1"],
      "District 3": ["Quận 3"],
      "Quận 3": ["District 3"],
      "District 4": ["Quận 4"],
      "Quận 4": ["District 4"],
      "District 5": ["Quận 5"],
      "Quận 5": ["District 5"],
      "District 6": ["Quận 6"],
      "Quận 6": ["District 6"],
      "District 7": ["Quận 7"],
      "Quận 7": ["District 7"],
      "District 8": ["Quận 8"],
      "Quận 8": ["District 8"],
      "District 10": ["Quận 10"],
      "Quận 10": ["District 10"],
      "District 11": ["Quận 11"],
      "Quận 11": ["District 11"],
      "Bình Thạnh": ["Quận Bình Thạnh"],
      "Quận Bình Thạnh": ["Bình Thạnh"],
      "Tân Bình": ["Quận Tân Bình"],
      "Quận Tân Bình": ["Tân Bình"],
      "Tân Phú": ["Quận Tân Phú"],
      "Quận Tân Phú": ["Tân Phú"],
      "Phú Nhuận": ["Quận Phú Nhuận"],
      "Quận Phú Nhuận": ["Phú Nhuận"],
      "Gò Vấp": ["Quận Gò Vấp"],
      "Quận Gò Vấp": ["Gò Vấp"],
      "Bình Tân": ["Quận Bình Tân"],
      "Quận Bình Tân": ["Bình Tân"],
      "Củ Chi": ["Huyện Củ Chi"],
      "Huyện Củ Chi": ["Củ Chi"],
      "Hóc Môn": ["Huyện Hóc Môn"],
      "Huyện Hóc Môn": ["Hóc Môn"],
      "Bình Chánh": ["Huyện Bình Chánh"],
      "Huyện Bình Chánh": ["Bình Chánh"],
      "Nhà Bè": ["Huyện Nhà Bè"],
      "Huyện Nhà Bè": ["Nhà Bè"],
      "Cần Giờ": ["Huyện Cần Giờ"],
      "Huyện Cần Giờ": ["Cần Giờ"],
    }

    // Thêm các biến thể vào mảng
    for (const name of [...possibleNames]) {
      if (districtMapping[name]) {
        possibleNames.push(...districtMapping[name])
      }
    }

    // Thêm các tiền tố phổ biến
    const prefixes = ["Quận ", "Huyện ", "Thành phố "]
    const basenames = [...possibleNames]

    for (const name of basenames) {
      if (!name) continue

      // Thêm phiên bản không có tiền tố
      for (const prefix of prefixes) {
        if (name.startsWith(prefix) && prefix !== "") {
          possibleNames.push(name.substring(prefix.length))
        } else if (prefix !== "") {
          // Thêm phiên bản có tiền tố
          possibleNames.push(prefix + name)
        }
      }
    }

    // Loại bỏ các giá trị trùng lặp và rỗng
    return [...new Set(possibleNames)].filter((name) => name && name.trim() !== "")
  }

  // Hàm tạo mảng các tên phường/xã có thể từ dữ liệu địa chỉ
  const getWardNames = (addressComponents) => {
    const possibleNames = []

    // Thêm các giá trị có thể từ addressComponents
    if (addressComponents.quarter) possibleNames.push(addressComponents.quarter)
    if (addressComponents.village) possibleNames.push(addressComponents.village)
    if (addressComponents.neighbourhood) possibleNames.push(addressComponents.neighbourhood)
    if (addressComponents.suburb) possibleNames.push(addressComponents.suburb)

    // Thêm các tiền tố phổ biến
    const prefixes = ["Phường ", "Xã ", ""]
    const basenames = [...possibleNames]

    for (const name of basenames) {
      if (!name) continue

      // Thêm phiên bản không có tiền tố
      for (const prefix of prefixes) {
        if (name.startsWith(prefix) && prefix !== "") {
          possibleNames.push(name.substring(prefix.length))
        } else if (prefix !== "") {
          // Thêm phiên bản có tiền tố
          possibleNames.push(prefix + name)
        }
      }
    }

    // Loại bỏ các giá trị trùng lặp và rỗng
    return [...new Set(possibleNames)].filter((name) => name && name.trim() !== "")
  }

  // Hàm tìm tỉnh/thành phố phù hợp từ mảng tên có thể
  const findMatchingProvince = (provinceNames, provincesList) => {
    if (!provinceNames.length || !provincesList.length) return null

    // Chuẩn hóa tên tỉnh/thành phố để so sánh
    const normalizedProvinceNames = provinceNames.map((name) =>
      name
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""),
    )

    // Tìm tỉnh/thành phố phù hợp
    for (const province of provincesList) {
      const normalizedProvinceName = province.ProvinceName.toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")

      if (
        normalizedProvinceNames.some(
          (name) => normalizedProvinceName.includes(name) || name.includes(normalizedProvinceName),
        )
      ) {
        return province
      }
    }

    // Mặc định trả về Hồ Chí Minh nếu không tìm thấy
    return provincesList.find((p) => p.ProvinceName.includes("Hồ Chí Minh"))
  }

  // Hàm tìm quận/huyện phù hợp từ mảng tên có thể
  const findMatchingDistrict = (districtNames, districtsList) => {
    if (!districtNames.length || !districtsList.length) return null

    // Chuẩn hóa tên quận/huyện để so sánh
    const normalizedDistrictNames = districtNames.map((name) =>
      name
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""),
    )

    // Tìm quận/huyện phù hợp
    for (const district of districtsList) {
      const normalizedDistrictName = district.DistrictName.toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")

      if (
        normalizedDistrictNames.some(
          (name) => normalizedDistrictName.includes(name) || name.includes(normalizedDistrictName),
        )
      ) {
        return district
      }
    }

    return null
  }

  // Hàm tìm phường/xã phù hợp từ mảng tên có thể
  const findMatchingWard = (wardNames, wardsList) => {
    if (!wardNames.length || !wardsList.length) return null

    // Chuẩn hóa tên phường/xã để so sánh
    const normalizedWardNames = wardNames.map((name) =>
      name
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""),
    )

    // Tìm phường/xã phù hợp
    for (const ward of wardsList) {
      const normalizedWardName = ward.WardName.toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")

      for (const name of normalizedWardNames) {
        if (normalizedWardName.includes(name) || name.includes(normalizedWardName)) {
          return ward
        }
      }
    }

    return null
  }
  const MapClickHandler = ({ setFormData, formData, provinces, districts, wards, setSelectedLocation, setIsCalculatingFee }) => {
    const map = useMap()

    useEffect(() => {
      console.log("Map instance in MapClickHandler:", map)
      map.on("click", async (e) => {
        const lat = e.latlng.lat
        const lng = e.latlng.lng
        console.log("Map clicked:", { lat, lng })
        setSelectedLocation({ lat, lng })
        setIsCalculatingFee(true)

        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&addressdetails=1&bounded=1&viewbox=106.4,10.3,107.0,11.2`,
          )
          console.log("Nominatim full response:", response.data)

          if (response.data && response.data.address) {
            const address = response.data.display_name
            const addressComponents = response.data.address

            // Tạo mảng các tên tỉnh/thành phố, quận/huyện và phường/xã có thể
            const provinceNames = getProvinceNames(addressComponents)
            const districtNames = getDistrictNames(addressComponents)
            const wardNames = getWardNames(addressComponents)

            console.log("Possible province names:", provinceNames)
            console.log("Possible district names:", districtNames)
            console.log("Possible ward names:", wardNames)

            // Tìm tỉnh/thành phố phù hợp
            const matchedProvince = findMatchingProvince(provinceNames, provinces)

            if (matchedProvince) {
              const fetchedDistricts = await fetchDistricts(matchedProvince.ProvinceID)

              // Tìm quận/huyện phù hợp
              const matchedDistrict = findMatchingDistrict(districtNames, fetchedDistricts)

              if (matchedDistrict) {
                const fetchedWards = await fetchWards(matchedDistrict.DistrictID)

                // Tìm phường/xã phù hợp
                const matchedWard = findMatchingWard(wardNames, fetchedWards)

                if (matchedWard) {
                  setFormData({
                    ...formData,
                    address,
                    provinceId: matchedProvince.ProvinceID,
                    districtId: matchedDistrict.DistrictID,
                    wardCode: matchedWard.WardCode,
                  })
                } else {
                  console.warn("Không tìm thấy phường/xã khớp:", wardNames)
                  notification.warning({
                    message: "Không tìm thấy phường/xã chính xác",
                    description: "Địa chỉ được chọn không khớp với phường/xã hiện tại. Vui lòng kiểm tra lại.",
                  })
                  setFormData({
                    ...formData,
                    address,
                    provinceId: matchedProvince.ProvinceID,
                    districtId: matchedDistrict.DistrictID,
                    wardCode: formData.wardCode, // Giữ lại wardCode đã chọn trước đó
                  })
                }
              } else {
                console.warn("Không tìm thấy quận/huyện khớp:", districtNames)
                notification.warning({
                  message: "Không tìm thấy quận/huyện chính xác",
                  description: "Địa chỉ được chọn không khớp với quận/huyện hiện tại. Vui lòng kiểm tra lại.",
                })
                setFormData({
                  ...formData,
                  address,
                  provinceId: matchedProvince.ProvinceID,
                  districtId: formData.districtId,
                  wardCode: formData.wardCode,
                })
              }
            } else {
              console.warn("Không tìm thấy tỉnh/thành phố khớp:", provinceNames)
              notification.warning({
                message: "Không tìm thấy tỉnh/thành phố chính xác",
                description: "Địa chỉ được chọn không khớp với tỉnh/thành phố hiện tại. Vui lòng kiểm tra lại.",
              })
              setFormData({
                ...formData,
                address,
                provinceId: formData.provinceId,
                districtId: formData.districtId,
                wardCode: formData.wardCode,
              })
            }
            console.log("Updated formData:", formData)
          } else {
            throw new Error("Không thể lấy địa chỉ từ tọa độ")
          }
        } catch (error) {
          console.error("Lỗi khi lấy địa chỉ từ bản đồ:", error)
          notification.error({
            message: "Lỗi bản đồ",
            description: "Không thể lấy địa chỉ. Vui lòng thử lại.",
          })
          setFormData({
            ...formData,
            districtId: formData.districtId,
            wardCode: formData.wardCode,
          })
        } finally {
          setIsCalculatingFee(false)
        }
      })

      return () => map.off("click")
    }, [map, formData, provinces, districts, wards, setFormData, setSelectedLocation, setIsCalculatingFee])

    return null
  }
  // Xử lý khi thay đổi tỉnh/thành phố
  const handleProvinceChange = async (e) => {
    const provinceId = e.target.value
    setFormData({
      ...formData,
      provinceId,
      districtId: "",
      wardCode: "",
      address: "", // Reset address khi thay đổi tỉnh
    })

    if (provinceId) {
      await fetchDistricts(provinceId)
    } else {
      setDistricts([])
      setWards([])
    }
  }

  const handleDistrictChange = async (e) => {
    const districtId = e.target.value
    setFormData({
      ...formData,
      districtId,
      wardCode: "",
      address: "", // Reset address khi thay đổi quận/huyện
    })

    if (districtId) {
      await fetchWards(districtId)
      fetchAvailableServices()
    } else {
      setWards([])
    }
  }

  const handleWardChange = (e) => {
    const wardCode = e.target.value
    setFormData({
      ...formData,
      wardCode,
      address: "",
    })
  }

  useEffect(() => {
    if (formData.provinceId && !isNaN(Number.parseInt(formData.provinceId))) {
      console.log("useEffect: Gọi fetchDistricts với provinceId:", formData.provinceId)
      fetchDistricts(formData.provinceId)
    }
  }, [formData.provinceId])

  useEffect(() => {
    if (formData.districtId && !isNaN(Number.parseInt(formData.districtId))) {
      console.log("useEffect: Gọi fetchWards và fetchAvailableServices với districtId:", formData.districtId)
      fetchWards(formData.districtId)
      fetchAvailableServices()
    } else {
      setWards([])
      setAvailableServices([])
    }
  }, [formData.districtId])
  const { search } = useLocation()

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Kết nối với server qua WebSocket")
    })

    socket.on("billCreated", (response) => {
      console.log("Phản hồi từ server:", response)
      if (response.status === "success" && response.data?._id) {
        const isOnlinePayment = localStorage.getItem("isOnlinePayment") === "true"
        if (!isOnlinePayment) {
          clearCart()
          localStorage.removeItem("pendingBillData")
          localStorage.removeItem("isOnlinePayment")
          navigate(`/success?orderId=${response.data._id}`)
        } else {
          localStorage.setItem("pendingOrderId", response.data._id)
        }
      } else {
        notification.error({
          message: "Lỗi khi tạo hóa đơn",
          description: "Không thể tạo đơn hàng. Vui lòng thử lại.",
        })
      }
    })

    const queryParams = new URLSearchParams(search)
    const status = queryParams.get("status")
    if (status) {
      const orderId = localStorage.getItem("pendingOrderId")
      if (status === "SUCCESS" && orderId) {
        clearCart()
        localStorage.removeItem("pendingOrderId")
        localStorage.removeItem("pendingBillData")
        localStorage.removeItem("isOnlinePayment")
        navigate(`/success?orderId=${orderId}`)
      } else {
        notification.error({
          message: "Thanh toán thất bại",
          description: "Thanh toán không thành công hoặc đã bị hủy.",
        })
        navigate("/checkout")
      }
    }

    return () => {
      socket.off("connect")
      socket.off("billCreated")
    }
  }, [search, navigate, clearCart])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    const finalTotal = totalPrice1 + shippingFee - (discount || 0) - (pointsUsed || 0);

    const provinceName =
      provinces.find((p) => p.ProvinceID === Number.parseInt(formData.provinceId))?.ProvinceName || "";
    const districtName =
      districts.find((d) => d.DistrictID === Number.parseInt(formData.districtId))?.DistrictName || "";
    const wardName = wards.find((w) => w.WardCode === formData.wardCode)?.WardName || "";

    const billData = {
      fullName: formData.fullName,
      address_shipment: `${formData.address}, ${wardName}, ${districtName}, ${provinceName}`,
      phone_shipment: formData.phone,
      ship: shippingFee,
      total_price: finalTotal,
      pointDiscount: pointsUsed,
      isPaid: paymentMethod === "online",
      voucher: voucherId,
      lineItems: cart.map((item) => ({
        product: item.id,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
        options: item.options.map((option) => ({
          optionId: option.optionId,
          choiceId: option.choiceId,
          addPrice: option.addPrice,
        })),
      })),
      note: formData.note || "",
    };
    if (userProfile?._id) {
      billData.account = userProfile._id;
    }

    if (paymentMethod === "cod") {
      localStorage.setItem("isOnlinePayment", "false");
      socket.emit("createBill", billData);
      setIsSubmitting(false); // Reset trạng thái sau khi gửi
    } else if (paymentMethod === "online") {
      try {
        localStorage.setItem("isOnlinePayment", "true");
        localStorage.setItem("pendingBillData", JSON.stringify(billData));

        // Create bill and wait for response
        const billResponse = await new Promise((resolve, reject) => {
          socket.emit("createBill", billData);
          socket.once("billCreated", (response) => {
            if (response.status === "success" && response.data?._id) {
              resolve(response);
            } else {
              reject(new Error("Lỗi khi tạo đơn hàng"));
            }
          });
          setTimeout(() => reject(new Error("Timeout chờ phản hồi từ server")), 10000);
        });

        const pendingOrderId = billResponse.data._id;
        localStorage.setItem("pendingOrderId", pendingOrderId);

        const paymentResponse = await axios.post(
          "https://fastfood-online-backend.onrender.com/create-payment-link",
          {
            amount: finalTotal,
            returnUrl: `https://fast-food-zeta-five.vercel.app/success?orderId=${pendingOrderId}`,
            cancelUrl: "https://fast-food-zeta-five.vercel.app/checkout",
            orderCode: pendingOrderId,
          },
          { headers: { Authorization: `Bearer ${jwt}` } }
        );

        if (paymentResponse.data && paymentResponse.data.paymentLink) {
          window.location.href = paymentResponse.data.paymentLink;
        } else {
          throw new Error("Không thể tạo liên kết thanh toán");
        }
      } catch (error) {
        console.error("Lỗi khi tạo đơn hàng hoặc liên kết thanh toán:", error);
        notification.error({
          message: "Lỗi thanh toán",
          description: "Không thể tạo đơn hàng hoặc liên kết thanh toán. Vui lòng thử lại.",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  useEffect(() => {
    if (userProfile) {
      setFormData({
        fullName: userProfile.fullname || "",
        address: "",
        phone: userProfile.phonenumber || "",
        note: "",
        provinceId: "",
        districtId: "",
        wardCode: "",
      })
    }
  }, [userProfile])

  const totalPrice1 = cart.reduce((acc, item) => {
    const totalAddPrice = item.options.reduce((optionAcc, opt) => optionAcc + (opt.addPrice || 0), 0)
    return acc + (item.price + totalAddPrice) * item.quantity
  }, 0)

  const finalTotal = totalPrice1 + shippingFee - (discount || 0) - (pointsUsed || 0)

  const getOptionName = async (optionalId) => {
    if (!optionals || optionals.length === 0) {
      return "Không tìm thấy tên tùy chọn"
    }
    const option = optionals.find((opt) => opt._id === optionalId)

    dispatch(getChoicesByOptionalId({ optionalId, jwt }))
      .then((response) => {
        setChoices((prevChoices) => ({
          ...prevChoices,
          [optionalId]: response,
        }))
      })
      .catch((error) => {
        console.error("Lỗi khi lấy lựa chọn:", error)
      })

    return option ? option.name : ""
  }

  const getChoiceName = (optionalId, choiceId) => {
    const choiceList = choices[optionalId]
    if (!choiceList || choiceList.length === 0) {
      return ""
    }
    const choice = choiceList.find((ch) => ch._id === choiceId)
    return choice ? choice.name : "Không có tên lựa chọn"
  }

  useEffect(() => {
    const fetchOptionNames = async () => {
      const names = {}
      for (const item of cart) {
        for (const opt of item.options) {
          names[opt.optionId] = await getOptionName(opt.optionId)
        }
      }
    }

    if (cart.length > 0) {
      fetchOptionNames()
    }
  }, [cart, optionals])

  return (
    <div className="container mx-auto p-8 mt-24 mb-12 flex flex-col">
      <div className="flex justify-between">
        <h1 style={{ color: "#ff7d01" }} className="text-3xl font-bold mb-6">
          THANH TOÁN
        </h1>
        <Button
          variant="contained"
          style={{
            color: "#fff",
            backgroundColor: "#ff7d01",
            width: "100px",
            marginBottom: "20px",
          }}
          onClick={() => navigate(-1)}
        >
          Quay về
        </Button>
      </div>

      <div className="flex justify-between">
        <div className="w-1/2 border rounded-lg p-6 mr-6">
          <h2 className="text-xl font-bold mb-4">Thông tin giao hàng</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              required
              id="fullName"
              name="fullName"
              label="Họ và tên"
              variant="outlined"
              onChange={handleInputChange}
              value={formData.fullName}
              style={{ marginBottom: "16px" }}
            />
            <TextField
              fullWidth
              required
              id="phone"
              name="phone"
              label="Số điện thoại"
              variant="outlined"
              onChange={handleInputChange}
              value={formData.phone}
              style={{ marginBottom: "16px" }}
            />
            {/* Thêm dropdown tỉnh/thành phố */}
            <FormControl fullWidth style={{ marginBottom: "16px" }}>
              <InputLabel id="province-label">Tỉnh/Thành phố</InputLabel>
              <Select
                labelId="province-label"
                id="provinceId"
                name="provinceId"
                value={formData.provinceId}
                label="Tỉnh/Thành phố"
                onChange={handleProvinceChange}
              >
                {provinces.map((province) => (
                  <MenuItem key={province.ProvinceID} value={province.ProvinceID}>
                    {province.ProvinceName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth style={{ marginBottom: "16px" }}>
              <InputLabel id="district-label">Quận/Huyện</InputLabel>
              <Select
                labelId="district-label"
                id="districtId"
                name="districtId"
                value={formData.districtId}
                label="Quận/Huyện"
                onChange={handleDistrictChange}
                disabled={!formData.provinceId}
              >
                {districts.map((district) => (
                  <MenuItem key={district.DistrictID} value={district.DistrictID}>
                    {district.DistrictName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth style={{ marginBottom: "16px" }}>
              <InputLabel id="ward-label">Phường/Xã</InputLabel>
              <Select
                labelId="ward-label"
                id="wardCode"
                name="wardCode"
                value={formData.wardCode}
                label="Phường/Xã"
                onChange={handleWardChange}
                disabled={!formData.districtId}
              >
                {wards.map((ward) => (
                  <MenuItem key={ward.WardCode} value={ward.WardCode}>
                    {ward.WardName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              required
              id="address"
              name="address"
              label="Địa chỉ chi tiết"
              variant="outlined"
              value={formData.address}
              style={{ marginBottom: "16px" }}
              helperText="Nhấp vào bản đồ để chọn địa chỉ chính xác"
              InputProps={{
                readOnly: true, // Làm cho trường địa chỉ chỉ đọc
              }}
            />
            <TextField
              fullWidth
              id="note"
              name="note"
              label="Ghi chú"
              variant="outlined"
              onChange={handleInputChange}
              value={formData.note}
              style={{ marginBottom: "16px" }}
            />
            <div className="mb-6">
              <label className="text-lg font-semibold mb-2 block">Phương thức thanh toán</label>
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                sx={{ display: "flex", flexDirection: "column", gap: 1 }}
              >
                <FormControlLabel value="cod" control={<Radio />} label="Thanh toán khi nhận hàng" sx={{ margin: 0 }} />
                <FormControlLabel value="online" control={<Radio />} label="Thanh toán online" sx={{ margin: 0 }} />
              </RadioGroup>
            </div>
            <Button
              fullWidth
              variant="contained"
              type="submit"
              style={{
                color: "#fff",
                backgroundColor: 
                  !formData.provinceId ||
                  !formData.districtId ||
                  !formData.wardCode ||
                  !formData.address
                    ? "#ccc" // màu xám khi disabled
                    : "#ff7d01", // màu cam khi enabled
                cursor:
                  !formData.provinceId ||
                  !formData.districtId ||
                  !formData.wardCode ||
                  !formData.address
                    ? "not-allowed"
                    : "pointer",
              }}
              disabled={
                !formData.provinceId ||
                !formData.districtId ||
                !formData.wardCode ||
                !formData.address
              }
            >
              Thanh toán {finalTotal ? finalTotal.toLocaleString() : "0"} đ
            </Button>
          </form>
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Chọn vị trí giao hàng trên bản đồ</h3>
            <div className="relative">
              {isCalculatingFee && (
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center z-10 rounded-lg">
                  <div className="bg-white p-4 rounded-lg shadow-lg">
                    <p className="text-center">Đang tính phí giao hàng...</p>
                  </div>
                </div>
              )}
              <MapContainer
                ref={mapRef}
                center={[STORE_LOCATION.lat, STORE_LOCATION.lng]}
                zoom={14}
                style={{ height: "400px", width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker position={[STORE_LOCATION.lat, STORE_LOCATION.lng]}>
                  <Popup>Cửa hàng</Popup>
                </Marker>
                {selectedLocation && (
                  <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
                    <Popup>Giao hàng</Popup>
                  </Marker>
                )}
                {selectedLocation && <RoutingMachine destination={selectedLocation} setShippingFee={setShippingFee} />}
                <MapClickHandler
                  setFormData={setFormData}
                  formData={formData}
                  provinces={provinces}
                  districts={districts}
                  wards={wards}
                  setSelectedLocation={setSelectedLocation}
                  setIsCalculatingFee={setIsCalculatingFee}
                />
                <MapFocusHandler
                  wardCode={formData.wardCode}
                  wards={wards}
                  districts={districts}
                  provinces={provinces}
                  provinceId={formData.provinceId}
                  districtId={formData.districtId}
                  mapRef={mapRef}
                />
              </MapContainer>
              <div className="mt-2 text-sm text-gray-600">
                <p>* Nhấp vào bản đồ để chọn vị trí giao hàng và tính phí tự động</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/2">
          <div className="border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">{totalQuantity} MÓN</h2>
            {cart.length > 0 ? (
              cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between border rounded-lg p-4 gap-4 mb-4">
                  <img src={item.picture || "/placeholder.svg"} alt={item.name} className="w-16 h-16 rounded-md" />
                  <div className="flex-grow">
                    <h2 className="text-lg font-semibold">{item.name}</h2>
                    <button onClick={() => handleRemove(item.id)} className="text-sm text-blue-500 hover:underline">
                      x {item.quantity}
                    </button>
                    {item.options && item.options.length > 0 && (
                      <div className="text-sm text-gray-500">
                        {item.options.map((option) => (
                          <div key={option.optionId} className="flex justify-between">
                            {getChoiceName(option.optionId, option.choiceId) || ""}
                            {option.addPrice ? ` (+${option.addPrice.toLocaleString()} đ)` : ""}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-lg font-semibold">
                    {(
                      item.price * item.quantity +
                      item.options.reduce(
                        (acc, option) => acc + (option.addPrice ? option.addPrice * item.quantity : 0),
                        0,
                      )
                    ).toLocaleString()}{" "}
                    đ
                  </span>
                </div>
              ))
            ) : (
              <p>Giỏ hàng trống</p>
            )}
            {cart.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Tổng đơn hàng</span>
                  <span>{totalPrice1.toLocaleString()} đ</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí giao hàng</span>
                  <span>{shippingFee.toLocaleString()} đ</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá</span>
                    <span>-{discount.toLocaleString()} đ</span>
                  </div>
                )}
                {pointsUsed > 0 && (
                  <div className="flex justify-between text-blue-600">
                    <span>Điểm đã dùng</span>
                    <span>-{pointsUsed.toLocaleString()} đ</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-xl">
                  <span>Tổng thanh toán</span>
                  <span>{finalTotal ? finalTotal.toLocaleString() : "0"} đ</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
