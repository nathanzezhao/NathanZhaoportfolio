import CardSwap, { Card } from './CardSwap.jsx';
import './PageSwap.css';

export const PAGE_TITLES = ['About', 'Projects', 'Experience'];

export function PageSheet({ title, closing, onBack }) {
  return (
    <div
      className={`page-sheet${closing ? ' is-out' : ''}`}
      onClick={onBack}
      role="presentation"
    >
      <h1 className="page-sheet__title">{title}</h1>
    </div>
  );
}

export default function PageSwap({
  titles = PAGE_TITLES,
  closing,
  covered,
  swapSignal = 0,
  swapIndex = null,
  onDismiss,
  onSelect,
}) {
  return (
    <div
      className={`page-swap${closing ? ' is-out' : ''}${covered ? ' is-covered' : ''}`}
      onClick={onDismiss}
      role="presentation"
    >
      <div
        className="page-swap__stage"
        onClick={e => e.stopPropagation()}
      >
        <CardSwap
          width={500}
          height={400}
          cardDistance={60}
          verticalDistance={70}
          autoPlay={false}
          swapSignal={swapSignal}
          swapIndex={swapIndex}
          pauseOnHover={false}
          skewAmount={6}
          easing="elastic"
        >
          {titles.map(title => (
            <Card key={title} customClass="swap-card">
              <button
                type="button"
                className="swap-card__header"
                onClick={e => {
                  e.stopPropagation();
                  const card = e.currentTarget.closest('.card');
                  onSelect?.(title, (card || e.currentTarget).getBoundingClientRect());
                }}
              >
                {title}
              </button>
              <div className="swap-card__body" />
            </Card>
          ))}
        </CardSwap>
      </div>
    </div>
  );
}
