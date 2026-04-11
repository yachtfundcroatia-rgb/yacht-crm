export default function HomeFeatures() {
  const features = [
    {
      icon: "📍",
      title: "Prime Locations",
      description: "Based in Split and Dubrovnik, the heart of Adriatic nautical tourism.",
      image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Croatia_location_map.svg/800px-Croatia_location_map.svg.png",
    },
    {
      icon: "🛡",
      title: "Asset Backed",
      description: "Your investment is secured by physical, high-value luxury yacht assets.",
      image: "https://images.pexels.com/photos/1209978/pexels-photo-1209978.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
    {
      icon: "💼",
      title: "Tax Optimized",
      description: "Efficient structure leveraging local nautical tax benefits for EU investors.",
      image: "https://images.pexels.com/photos/187041/pexels-photo-187041.jpeg?auto=compress&cs=tinysrgb&w=800",
    },
  ];

  return (
    <section className="py-20 px-6 lg:px-20 bg-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
        {features.map((f) => (
          <div key={f.title} className="bg-[#f6f7f8] rounded-2xl overflow-hidden border border-gray-100">
            <div className="p-6">
              <div className="text-2xl mb-4">{f.icon}</div>
              <h3 className="text-xl font-black text-[#0a192f] mb-2">{f.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">{f.description}</p>
            </div>
            <div
              className="h-44 bg-cover bg-center"
              style={{ backgroundImage: `url(${f.image})` }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}