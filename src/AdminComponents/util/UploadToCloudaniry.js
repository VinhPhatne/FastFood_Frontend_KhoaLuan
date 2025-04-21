const upload_present = "food_order";
const cloud_name = "ddjnapodl";
//const folder_name = "food_order"
//const urls=[]
const api_url = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;

export const uploadImageToCloudinary = async (file) => {
  const data = new FormData();
  data.append("file", file);
  //data.append("folder", folder_name)
  data.append("upload_preset", upload_present);
  data.append("cloud_name", cloud_name);

  const res = await fetch(api_url, {
    method: "post",
    body: data,
  });

  const fileData = await res.json();
  return fileData.url;
};
