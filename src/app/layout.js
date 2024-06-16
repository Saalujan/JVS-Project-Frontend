// import { Inter } from "next/font/google";

import "./globals.css";
import "bootstrap/dist/css/bootstrap.css";
import BootstrapClient from "../components/BootstrapClient";
// import StoreProvider from "../redux/Provider";

import { Noto_Sans } from "@next/font/google";


const notoSans = Noto_Sans({
  weight: ["100","200","300","400", "500","600" ,"700","800","900"],
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
});



export const metadata = {
  title: "Jaffna Vehicle Spot (PVT) LTD",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={notoSans.className}>
        {/* <StoreProvider> */}
          {children}
          <BootstrapClient />
        {/* </StoreProvider> */}
      </body>
    </html>
  );
}
