export const formatUserName = (name: string | undefined): string => {
    if (!name) return "Profile";
    
    let formatted = name;
    
    // Check if name contains space and length > 5
    if (name.includes(' ')) {
      const [firstName, lastName] = name.split(' ');
      formatted = `${firstName[0].toUpperCase()} ${lastName.slice(0, 2)}`;
    }
    
    // Truncate to first 5 characters if needed
    return formatted.length > 5 
      ? formatted.slice(0, 5) 
      : formatted;
  };

  
  export const formatTime = (dateTime: string) => {
    const date = new Date(dateTime);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert to 12-hour format
    return `${hours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  };
