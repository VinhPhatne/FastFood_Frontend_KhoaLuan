import { Image } from "@mui/icons-material";
import { Button, Card, CardContent } from "@mui/material";

export default function AboutUs() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold text-primary mb-2">Về Crispy Delights</h1>
        <p className="text-xl text-muted-foreground">Nơi lý tưởng cho món ăn ngon đầu ngón tay!</p>
      </header>

      <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
        <div>
          <Image
            src="https://xjjxpgvupxgicqbqdgdj.supabase.co/storage/v1/object/public/images/fried-chicken.jpg"
            alt="Nhà hàng Crispy Delights"
            width={600}
            height={400}
            className="rounded-lg shadow-lg"
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Câu chuyện của chúng tôi</h2>
          <p className="text-muted-foreground mb-4">
            Được thành lập vào năm 2010, Crispy Delights bắt đầu như một nhà hàng nhỏ do gia đình sở hữu với niềm đam mê 
            phục vụ món gà rán giòn, mọng nước ngon nhất trong thành phố. Qua nhiều năm, chúng tôi đã mở rộng thực đơn 
            bao gồm các món mì ống ngon tuyệt và đồ uống giải khát, trở thành địa điểm yêu thích của địa phương cho 
            những bữa ăn nhanh và ngon miệng.
          </p>
          <p className="text-muted-foreground">
            Cam kết của chúng tôi về nguyên liệu chất lượng, công thức gia truyền bí mật và dịch vụ thân thiện đã giúp 
            chúng tôi phát triển từ một địa điểm duy nhất thành nhiều nhà hàng trên khắp thành phố.
          </p>
        </div>
      </div>

      <Card className="mb-12">
        <CardContent className="p-8">
          <h2 className="text-2xl font-semibold mb-6 text-center">Món đặc trưng của chúng tôi</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              {/* <Drumstick className="w-12 h-12 mx-auto mb-4 text-primary" /> */}
              <h3 className="text-xl font-semibold mb-2">Gà Rán Giòn</h3>
              <p className="text-muted-foreground">
                Món đặc trưng của chúng tôi, được làm với hỗn hợp gia vị và thảo mộc bí mật để tạo ra độ giòn hoàn hảo.
              </p>
            </div>
            <div className="text-center">
              {/* <UtensilsCrossed className="w-12 h-12 mx-auto mb-4 text-primary" /> */}
              <h3 className="text-xl font-semibold mb-2">Mì Ống Ngon</h3>
              <p className="text-muted-foreground">
                Từ mì Ý cổ điển đến fettuccine kem béo, các món mì ống của chúng tôi được làm để thỏa mãn vị giác.
              </p>
            </div>
            <div className="text-center">
              {/* <Coffee className="w-12 h-12 mx-auto mb-4 text-primary" /> */}
              <h3 className="text-xl font-semibold mb-2">Đồ Uống Giải Khát</h3>
              <p className="text-muted-foreground">
                Nhiều lựa chọn nước ngọt, trà đá và đồ uống pha chế đặc biệt để giải khát.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4">Ghé thăm chúng tôi ngay hôm nay!</h2>
        <p className="text-muted-foreground mb-6">
          Trải nghiệm sự kết hợp hoàn hảo giữa hương vị giòn, đậm đà và sảng khoái tại Crispy Delights. 
          Chúng tôi không chỉ là một quán ăn nhanh - chúng tôi là điểm đến cho những người yêu thích ẩm thực!
        </p>
        <Button size="lg" className="rounded-full">
          Tìm địa điểm gần bạn
        </Button>
      </div>
    </div>
  )
}