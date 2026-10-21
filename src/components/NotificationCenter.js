import { useEffect } from "react";

function NotificationCenter({ notifications, onDismiss }) {
  const toneLabel = {
    success: "Success",
    error: "Error",
    info: "Info",
  };

  const toneIcon = {
    success: "OK",
    error: "!",
    info: "i",
  };

  useEffect(() => {
    const timers = notifications.map((notification) => (
      setTimeout(() => onDismiss(notification.id), notification.duration || 4500)
    ));

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [notifications, onDismiss]);

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="notification-center" aria-live="polite">
      {notifications.map((notification) => (
        <div
          className={`toast toast-${notification.type}`}
          key={notification.id}
          role="status"
          aria-label={`${toneLabel[notification.type] || "Notification"}: ${notification.title}`}
        >
          <div className="toast-icon" aria-hidden="true">
            {toneIcon[notification.type] || "*"}
          </div>
          <div>
            <strong>{notification.title}</strong>
            <p>{notification.message}</p>
          </div>
          <button aria-label="Dismiss notification" onClick={() => onDismiss(notification.id)}>
            x
          </button>
        </div>
      ))}
    </div>
  );
}

export default NotificationCenter;
