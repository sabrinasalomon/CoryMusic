export type GreetingKey = 'greeting.morning' | 'greeting.afternoon' | 'greeting.evening';

export function greetingKey(date: Date = new Date()): GreetingKey {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return 'greeting.morning';
  if (hour >= 12 && hour < 19) return 'greeting.afternoon';
  return 'greeting.evening';
}
