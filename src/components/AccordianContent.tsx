import { useRef, useEffect } from "react";

type AccordianProps = {
    isExpanded: boolean
    children: JSX.Element | JSX.Element[]
}
  
const AccordionContent = ({ isExpanded, children } : AccordianProps) => {
    const contentRef = useRef<HTMLDivElement>(null);
  
    useEffect(() => {
      if (contentRef.current) {
        contentRef.current.style.height = isExpanded ? `${contentRef.current.scrollHeight}px` : '0px';
      }
    }, [isExpanded]);
  
    return (
      <div
        ref={contentRef}
        className={`accordion-content`}
      >
        {children}
      </div>
    );
};

  export default AccordionContent