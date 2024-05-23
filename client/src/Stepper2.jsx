const Stepper = ({ totalSteps, currentStep, labels }) => {
    return (
      <div className="flex flex-col items-center my-24">
        <div className="flex justify-between w-full mb-4">
          {[...Array(totalSteps)].map((_, index) => (
            <div
              key={index}
              className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                index < currentStep ? 'bg-green-500 border-green-500' : 'border-gray-300'
              }`}
            >
              {index + 1}
            </div>
          ))}
        </div>
        <div className="flex justify-between w-full">
          {labels.map((label, index) => (
            <div key={index} className="text-xs text-center w-1/4">
              {label}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default Stepper;
  