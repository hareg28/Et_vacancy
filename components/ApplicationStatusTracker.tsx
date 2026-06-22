import styles from './ApplicationStatusTracker.module.css';

const STATUS_STAGES = [
  { id: 'applied', label: 'Applied' },
  { id: 'reviewed', label: 'Reviewed' },
  { id: 'interviewing', label: 'Interviewing' },
  { id: 'offer', label: 'Offer' },
];

interface ApplicationStatusTrackerProps {
  currentStatus: string;
}

export default function ApplicationStatusTracker({ currentStatus }: ApplicationStatusTrackerProps) {
  // Find the index of the current status
  const currentIndex = STATUS_STAGES.findIndex(stage => stage.id === currentStatus);
  const activeIndex = currentIndex === -1 ? 0 : currentIndex; // Default to 'applied' if not found or something else
  
  // If rejected, we might show a different UI, but for simplicity let's stick to the happy path pipeline
  const isRejected = currentStatus === 'rejected';

  return (
    <div className={styles.trackerContainer}>
      <div className={styles.timeline}>
        {STATUS_STAGES.map((stage, index) => {
          const isCompleted = index < activeIndex;
          const isActive = index === activeIndex;
          
          let statusClass = styles.pending;
          if (isCompleted) statusClass = styles.completed;
          if (isActive) statusClass = isRejected ? styles.rejected : styles.active;

          return (
            <div key={stage.id} className={`${styles.stage} ${statusClass}`}>
              <div className={styles.dotWrapper}>
                <div className={styles.line}></div>
                <div className={`${styles.dot} ${isActive && !isRejected ? 'pulse' : ''}`}>
                  {isCompleted && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                  {isActive && isRejected && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  )}
                </div>
              </div>
              <div className={styles.label}>{stage.label}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
