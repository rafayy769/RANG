import { Card } from "../../types/card";

import "../../styles/playing-cards.css";
import "../../styles/rang.css";

interface cardComponentProps {
  card: Card;
  myHand: boolean;
  handleClick: Function;
}
function CardComponent({ card, myHand, handleClick }: cardComponentProps) {
  return card.rank === "" ? (
    <div className="card back">*</div>
  ) : myHand ? (
    <a
      className={`card rank-${card.rank} ${card.suit_name}`}
      onClick={() => handleClick(card)}
    >
      <span className="rank">{card.rank}</span>
      <span className="suit">{card.suit_symbol}</span>
    </a>
  ) : (
    <div
      className={`card rank-${card.rank} ${card.suit_name}`}
      onClick={() => handleClick(card)}
    >
      <span className="rank">{card.rank}</span>
      <span className="suit">{card.suit_symbol}</span>
    </div>
  );
}

export default CardComponent;