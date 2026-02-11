"use client"
import React, { useState } from "react";
import PackagesSlideLocomotive from "../Packages/PackagesSlideLocomotive";
import DestinationsSlideLocomotive from "./DestinationsSlide/DestinationsSlideLocomotive";
const Wrapper = () => {

    const [dest, setDest] = useState(<DestinationsSlideLocomotive/>)
    
    return <>{dest ? dest : (<PackagesSlideLocomotive/>)}</>;
};

export default Wrapper;
