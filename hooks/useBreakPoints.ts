import { useEffect, useState } from "react";

const useBreakPoints = () => {
  const [width, setWidth] = useState(0);

  const handleResize = () => setWidth(window.innerWidth);
  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isMobile = width <= 768;

  return {
    isMobile,
  };
};

export default useBreakPoints;
