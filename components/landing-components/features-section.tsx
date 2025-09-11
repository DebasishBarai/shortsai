import {
  Film,
  Layers,
  CirclePlay,
  Mic,
  Scissors,
  Rocket,
} from "lucide-react";

export const Features = () => {
  const features = [
    {
      title: "Generate Short Films",
      description: "Turn your ideas into cinematic AI-powered short movies in minutes.",
      icon: <Film className="w-8 h-8 text-pink-400" />,
    },
    {
      title: "Episode-Based Films",
      description: "Create multi-episode series with consistent storylines and visuals.",
      icon: <Layers className="w-8 h-8 text-purple-400" />,
    },
    {
      title: "Consistent Characters",
      description: "AI maintains your characters' look and style throughout scenes.",
      icon: <CirclePlay className="w-8 h-8 text-blue-400" />,
    },
    {
      title: "Voice Narration",
      description: "Choose from multiple voices and narrators for immersive storytelling.",
      icon: <Mic className="w-8 h-8 text-green-400" />,
    },
    {
      title: "Scene-by-Scene Editing",
      description: "Fine-tune every moment of your AI-generated video effortlessly.",
      icon: <Scissors className="w-8 h-8 text-yellow-400" />,
    },
    {
      title: "3-Click Movie Export",
      description: "Produce and download your movie with one-click simplicity.",
      icon: <Rocket className="w-8 h-8 text-red-400" />,
    },
  ];

  return (
    <div className="z-20 py-20 text-white text-center px-6">
      <h2 className="text-3xl md:text-5xl font-bold mb-10">
        Everything You Need to{" "}
        <span className="text-pink-400">Create AI Movies</span>
      </h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="bg-gray-800 p-6 rounded-2xl shadow hover:shadow-pink-500/20 transition"
          >
            <div className="flex justify-center mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
