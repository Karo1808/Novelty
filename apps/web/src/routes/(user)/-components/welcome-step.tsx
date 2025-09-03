const WelcomeStep = () => {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto w-24 h-24 rounded-full bg-indigo-900/30 flex items-center justify-center mb-4">
        <span className="text-4xl">👋</span>
      </div>
      <h2 className="text-3xl font-bold text-slate-100">Welcome to Novelty!</h2>
      <p className="text-lg text-slate-300 max-w-2xl mx-auto">
        Let's get you set up in just a few quick steps. We'll personalize your
        experience based on your preferences.
      </p>
    </div>
  );
};

export default WelcomeStep;
