import { useState } from "react";
import '../styles/fade.css'

interface FadeElementsProps {
    elements: React.ReactNode[];
    direction: string;
  }

const FadeText: React.FC<FadeElementsProps> = ({ elements, direction }) => {
    const [isVisible, setIsVisible] = useState<boolean>(true);

    const handleToggleText = () => {
        setIsVisible((prevVisible) => !prevVisible);
      };
    
    return (
        <div>
            {isVisible && <div className="text-container">
                {elements.map((item, index) => (
                    <div key={index} className={direction}>{item}</div>
                ))}
            </div>
            }
        </div>

    );
}

export default FadeText;