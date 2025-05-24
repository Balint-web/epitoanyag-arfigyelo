import React, { useState } from "react";
import { motion } from "framer-motion";
import "./Gyik.css";

const questions = [
  {
    question: "Hogyan működik az árfigyelés?",
    answer:
      "A rendszer naponta frissíti a termékek árait a különböző webshopokból.",
  },
  {
    question: "Szükséges regisztráció a használathoz?",
    answer:
      "Nem, de ha kedvenceket akarsz menteni, akkor igen.",
  },
  {
    question: "Milyen gyakran frissülnek az adatok?",
    answer: "Jelenleg naponta frissítjük az árakat.",
  },
  {
    question: "Hogyan működik a kedvencek hozzáadása?",
    answer: "A termékek alatt található szív ikonra kattintva elmentheted őket.",
  },
];

const Gyik = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleQuestion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="gyik-container">
      <motion.h2
        className="gyik-title"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        🤔 Gyakran Ismételt Kérdések
      </motion.h2>
      <div className="gyik-list">
        {questions.map((item, index) => (
          <motion.div
            key={index}
            className={`gyik-item ${activeIndex === index ? "active" : ""}`}
            onClick={() => toggleQuestion(index)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <h3 className="gyik-question">{item.question}</h3>
            {activeIndex === index && (
              <motion.p
                className="gyik-answer"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {item.answer}
              </motion.p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Gyik;
