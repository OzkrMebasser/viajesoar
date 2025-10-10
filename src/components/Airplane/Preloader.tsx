// "use client";
// import { useRef } from "react";
// import styles from "./Preloader.module.css";
// import { useTranslations } from "next-intl";


// interface PreloaderProps {
//   isLoading: boolean;
// }

// export default function Preloader({ isLoading }: PreloaderProps) {
//   const preloaderRef = useRef<HTMLDivElement>(null);
//   const t = useTranslations("Navigation");

//   const handleAnimationComplete = () => {
//   console.log('All letters have animated!');
// };


//   if (!isLoading) return null;

//   return (
//     <div
//       ref={preloaderRef}
//       aria-hidden="true"
//       // className={` fixed inset-0 z-50 ${styles.cloudsBg} flex items-center justify-center bg-radial-at-l from-sky-400 to-indigo-900`}
//       className={`fixed inset-0 z-50 ${styles.cloudsBg} flex items-center justify-center bg-gradient-to-r from-[#1842a3] to-[#4286f4]`}
//     >
//       {/* Nubes */}
//       <div className={styles.clouds}>
//         <div className={`${styles.cloud} ${styles.x1}`}></div>
//         <div className={`${styles.cloud} ${styles.x2}`}></div>
//         <div className={`${styles.cloud} ${styles.x3}`}></div>
//         <div className={`${styles.cloud} ${styles.x4}`}></div>
//         <div className={`${styles.cloud} ${styles.x5}`}></div>
//       </div>

//       {/* Avión y texto */}
//       <div className="relative z-10">
//         <img
//           src="/avion-loader.svg"
//           className="drop-shadow-[5px_8px_5px_rgba(0,0,0,.5)] mx-auto w-[180px] lg:w-[280px] "
//           alt=""
//         />
        
//         <h1
//           className={`${styles.title} text-3xl sm:text-4xl md:text-7xl font-semibold text-center tracking-wide px-6 uppercase text-[#252f35] mt-6`}
//         >
//           {t("soar1")}
//           <span className="animate-pulse text-white drop-shadow-[0_0_3px_black] mr-1">
//             Soar
//           </span>
//           {t("soar2")}
//         </h1>
//       </div>
//     </div>
//   );
// }
