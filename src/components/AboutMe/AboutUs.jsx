import { Image } from "@mui/icons-material";
import { Button, Card, CardContent } from "@mui/material";

export default function AboutUs() {
  return (
    <div className="container mx-auto px-4 py-12 mt-20">
      <header className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-primary mb-4">
          Về Crispy Delights
        </h1>
        <p className="text-lg text-muted-foreground">
          Khám phá hành trình ẩm thực tuyệt vời, nơi hương vị giòn tan hòa quyện
          cùng sự đậm đà tinh tế!
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div className="w-[600px] h-[400px] overflow-hidden rounded-lg shadow-2xl">
          <img
            src="https://th.bing.com/th/id/OIP.nlLzoFTxiH0oWisFZbtGjgHaE8?w=262&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7"
            alt="Nhà hàng Crispy Delights"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 ease-in-out"
          />
        </div>
        <div>
          <h2 className="text-3xl font-semibold mb-6">
            Hành trình của chúng tôi
          </h2>
          <p className="text-muted-foreground mb-6 leading-relaxed">
            Được thành lập vào năm 2010, **Crispy Delights** bắt đầu với niềm
            đam mê phục vụ món gà rán thơm ngon, giòn rụm. Ban đầu chỉ là một
            quán nhỏ do gia đình điều hành, chúng tôi đã không ngừng mở rộng và
            nâng cao thực đơn, mang đến nhiều món ăn hấp dẫn khác như mì ống
            tươi ngon và các loại đồ uống giải khát độc đáo.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Chúng tôi luôn cam kết sử dụng nguyên liệu tươi ngon nhất và công
            thức gia truyền để mang đến trải nghiệm tuyệt vời cho thực khách. Từ
            một nhà hàng nhỏ, **Crispy Delights** giờ đây đã trở thành chuỗi nhà
            hàng nổi tiếng trong thành phố.
          </p>
        </div>
      </div>

      <Card className="mb-16 shadow-lg">
        <CardContent className="p-10">
          <h2 className="text-3xl font-semibold mb-8 text-center">
            Món đặc trưng của chúng tôi
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <img
                src="https://static.kfcvietnam.com.vn/images/items/lg/2-Fried-Chicken.jpg?v=4lY0lg"
                alt="Gà Rán Giòn"
                className="w-20 h-20 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Gà Rán Giòn</h3>
              <p className="text-muted-foreground">
                Món ăn làm nên tên tuổi của chúng tôi với lớp vỏ ngoài giòn tan
                và gia vị bí truyền.
              </p>
            </div>

            <div className="text-center">
              <img
                src="https://static.kfcvietnam.com.vn/images/items/lg/MI-Y-GA-VIEN.jpg?v=4lY0lg"
                alt="Mì Ống Ngon"
                className="w-20 h-20 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Mì Ống Tươi Ngon</h3>
              <p className="text-muted-foreground">
                Thực đơn phong phú với đủ loại mì ống hấp dẫn, từ spaghetti đến
                fettuccine.
              </p>
            </div>

            <div className="text-center">
              <img
                src="https://th.bing.com/th/id/OIP.n8iP4dN2sX7qikSY4KdydQHaE7?w=286&h=189&c=7&r=0&o=5&dpr=1.3&pid=1.7"
                alt="Đồ Uống Giải Khát"
                className="w-20 h-20 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">Đồ Uống Giải Khát</h3>
              <p className="text-muted-foreground">
                Nhiều lựa chọn đồ uống tươi mát, từ trà đá đến nước pha chế đặc
                biệt.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <h2 className="text-3xl font-semibold mb-6">
          Ghé thăm chúng tôi ngay hôm nay!
        </h2>
        <p className="text-lg text-muted-foreground mb-8">
          Trải nghiệm sự kết hợp hoàn hảo giữa hương vị giòn rụm và món ăn tinh
          tế tại **Crispy Delights**. Chúng tôi không chỉ là quán ăn nhanh –
          chúng tôi là điểm đến lý tưởng cho những tâm hồn yêu ẩm thực!
        </p>
        <Button
          size="large"
          variant="contained"
          color="primary"
          className="rounded-full px-6 py-3"
          style={{ backgroundColor: "#ff7d01" }}
        >
          Tìm địa điểm gần bạn
        </Button>
      </div>
    </div>
  );
}
