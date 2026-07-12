function ordinal(n) {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// StoryCard.jsx wants: { slug, title, excerpt, coverImage, category, location, author, tale, readTime }
// Our data has: author as {name,...}, tale_number, readMinutes.
// Adapt here so StoryCard (fixed Step D component) never needs to change.
export function toCardProps(story) {
  return {
    ...story,
    author: story.author.name,
    tale: `${ordinal(story.tale_number)} tale`,
    readTime: story.readMinutes,
  };
}
