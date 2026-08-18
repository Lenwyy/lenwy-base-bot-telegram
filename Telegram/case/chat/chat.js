export const info = {
  name: "Chat",
  case: ["chat"],
  description: "Chat sederhana",
  hidden: false,
  owner: false,
  group: false,
  private: false,
};

export default async function handler(leni) {
  await leni.LenwyText("Berfungsi");
}
