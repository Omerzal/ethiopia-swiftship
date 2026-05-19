const cities = [
  "Addis Ababa", "Hawassa", "Bahir Dar", "Mekelle", "Dire Dawa", "Adama",
  "Gondar", "Jimma", "Dessie", "Jijiga", "Arba Minch", "Shashemene", "Harar", "Nekemte",
];

export function CitiesMarquee() {
  return (
    <section className="relative py-10 border-y border-white/5 bg-white/[0.02]">
      <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
        <div className="flex gap-10 animate-marquee whitespace-nowrap text-muted-foreground font-display">
          {[...cities, ...cities].map((c, i) => (
            <span key={i} className="text-lg flex items-center gap-10">
              <span className="size-1.5 rounded-full bg-primary inline-block" />
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
