import { useEffect } from "react";

const useOutSideClick = (ref, close) => {
  useEffect(() => {
    const handleClickOutSide = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        close();
      }
    };
    window.addEventListener("mousedown", handleClickOutSide);
    return () => {
      window.removeEventListener("mousedown", handleClickOutSide);
    };
  }, [ref, close]);
};

export default useOutSideClick;
