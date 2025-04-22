import React from "react";

interface TripProgressTrackerProps {
  tripType: "one-way" | "round";
  tripCycleStep: string;
  roundTripCycleStep: string;
}

const TripProgressTracker: React.FC<TripProgressTrackerProps> = ({
  tripType,
  tripCycleStep,
  roundTripCycleStep,
}) => {
  const oneWaySteps = [
    "SEARCHING",
    "SELECTING_TRIP",
    "SELECTING_SEATS",
    "CONFIRMING_RESERVATION",
  ];

  const roundTripSteps = [
    "SEARCHING",
    "SELECTING_OUTBOUND_TRIP",
    "SELECTING_OUTBOUND_SEATS",
    "SELECTING_RETURN_TRIP",
    "SELECTING_RETURN_SEATS",
    "CONFIRMING_RESERVATION",
  ];

  const steps = tripType === "one-way" ? oneWaySteps : roundTripSteps;
  const currentStepIndex = steps.indexOf(
    tripType === "one-way" ? tripCycleStep : roundTripCycleStep
  );

  return (
    <div className="w-full flex justify-center px-4 sm:px-6 md:px-8 max-sm:px-1 mx-auto  max-sm:mx-0 max-sm:bg-white">
      <div className="flex overflow-y-hidden    overflow-x-auto  max-sm:hidden w-full items-center justify-center  ">
        {steps.map((step, index) => {
          const isCurrent = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          const isUpcoming = index > currentStepIndex;
          const bgColor =
            isCompleted || isCurrent
              ? "bg-[#0074C3] text-white"
              : "bg-[#F59E0B] text-black";
          const borderColor =
            isCompleted || isCurrent
              ? "border-white "
              : "border-white text-black";

          return (
            <div
              key={step}
              className={`flex items-center justify-end text-sm font-semibold w-full ${bgColor} ${
                index === 0 || index === steps.length - 1
                  ? "h-12"
                  : " h-12"
              } border border-gray-300 `}
            >
              {index === 0 || index === steps.length - 1 ? (
                <span className="ml-12">{step.replace("_", " ")}</span>
              ) : (
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fontSize="10"
                  fill={isCompleted || isCurrent ? "white" : "black"}
                  className="ml-14"
                >
                  {step.replace("_", " ")}
                </text>
              )}
              <div
                className={`w-10 h-10 block ${bgColor} ${borderColor} border-0 border-r-2 border-t-2  rounded rotate-45 translate-x-4`}
              ></div>
            </div>
          );
        })}
      </div>
      <div className="flex w-full  max-sm:max-w-screen-sm overflow-x-scroll sm:hidden ">
        {steps.map((step, index) => {
          const isCurrent = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          const isUpcoming = index > currentStepIndex;
          const bgColor =
            isCompleted || isCurrent
              ? "bg-[#E8ECF2] max-sm:bg-white text-white"
              : "bg-[#FCF1EE] max-sm:bg-white text-black";
          const borderColor =
            isCompleted || isCurrent
              ? "border-white "
              : "border-white text-black";

          return (
            <div
              key={step}
              className={`flex items-center justify-center text-sm font-semibold w-full  ${bgColor} ${
                index === 0 || index === steps.length - 1
                  ? "w-fit h-12"
                  : "w-fit h-12"
              } border border-gray-300 `}
            >
              { isCurrent ? (
                <span className="mx-2 flex flex-row-reverse gap-3 text-primary text-center items-center" >
                  <div>{step}</div>
                  <div>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_3301_17264)">
                      <path
                        d="M4.04873 2.86182C3.0795 2.86182 2.29102 3.6503 2.29102 4.61954C2.29102 5.58877 3.0795 6.37725 4.04873 6.37725C5.01797 6.37725 5.80645 5.58877 5.80645 4.61954C5.80645 3.65035 5.01797 2.86182 4.04873 2.86182ZM4.04873 4.97114C3.85486 4.97114 3.69717 4.81346 3.69717 4.61958C3.69717 4.42571 3.85486 4.26802 4.04873 4.26802C4.24261 4.26802 4.4003 4.42571 4.4003 4.61958C4.40025 4.81346 4.24261 4.97114 4.04873 4.97114Z"
                        fill="#0074C3"
                      />
                      <path
                        d="M19.9062 14.403C18.9369 14.403 18.1484 15.1914 18.1484 16.1607C18.1484 17.1299 18.9369 17.9184 19.9062 17.9184C20.8754 17.9184 21.6639 17.1299 21.6639 16.1607C21.6639 15.1915 20.8754 14.403 19.9062 14.403ZM19.9062 16.5123C19.7123 16.5123 19.5546 16.3546 19.5546 16.1607C19.5546 15.9668 19.7123 15.8092 19.9062 15.8092C20.1 15.8092 20.2577 15.9668 20.2577 16.1607C20.2577 16.3546 20.1 16.5123 19.9062 16.5123Z"
                        fill="#0074C3"
                      />
                      <path
                        d="M22.8135 13.2977C21.2349 11.7191 18.6664 11.7191 17.0878 13.2977C15.7793 14.606 15.5241 16.6317 16.467 18.2238L18.7171 22.023H5.08711C3.88387 22.023 2.90494 21.0441 2.90494 19.8409C2.90494 18.6376 3.88383 17.6587 5.08711 17.6587H11.6894C13.668 17.6587 15.2778 16.0489 15.2778 14.0703C15.2778 12.0916 13.668 10.4819 11.6894 10.4819H5.2829L7.53295 6.68266C8.47584 5.0906 8.22056 3.0649 6.91223 1.75657C6.14751 0.991897 5.1308 0.570679 4.04934 0.570679C2.96789 0.570679 1.95112 0.991851 1.1864 1.75657C-0.121971 3.06494 -0.377205 5.09069 0.565686 6.68271L3.64861 11.8881H11.6894C12.8926 11.8881 13.8716 12.867 13.8716 14.0703C13.8716 15.2735 12.8927 16.2525 11.6894 16.2525H5.08711C3.10851 16.2525 1.49873 17.8623 1.49873 19.8409C1.49873 21.8195 3.10847 23.4292 5.08711 23.4292H20.3515L23.4344 18.2238C24.3772 16.6317 24.1219 14.606 22.8135 13.2977ZM1.77562 5.96618C1.16025 4.92705 1.32679 3.6049 2.18081 2.75098C2.67994 2.2518 3.3435 1.97698 4.0493 1.97698C4.75509 1.97698 5.41875 2.25185 5.91787 2.75098C6.7718 3.6049 6.93839 4.92705 6.32306 5.96618L4.04934 9.80529L1.77562 5.96618ZM22.2244 17.5072L19.9507 21.3463L17.6769 17.5072C17.0616 16.4681 17.2281 15.1459 18.0821 14.292C18.5973 13.7768 19.274 13.5193 19.9507 13.5193C20.6274 13.5193 21.3041 13.7769 21.8192 14.292C22.6732 15.1459 22.8398 16.4681 22.2244 17.5072Z"
                        fill="#0074C3"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_3301_17264">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  </div>

                </span>
              ) : (
                <text
                  x="50%"
                  y="50%"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fontSize="10"
                  fill={isCompleted || isCurrent ? "white" : "black"}
                  className="mx-2 flex flex-row-reverse gap-3 text-primary text-center items-center"
                >
                  {steps.indexOf(step) + 1}
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_3301_17264)">
                      <path
                        d="M4.04873 2.86182C3.0795 2.86182 2.29102 3.6503 2.29102 4.61954C2.29102 5.58877 3.0795 6.37725 4.04873 6.37725C5.01797 6.37725 5.80645 5.58877 5.80645 4.61954C5.80645 3.65035 5.01797 2.86182 4.04873 2.86182ZM4.04873 4.97114C3.85486 4.97114 3.69717 4.81346 3.69717 4.61958C3.69717 4.42571 3.85486 4.26802 4.04873 4.26802C4.24261 4.26802 4.4003 4.42571 4.4003 4.61958C4.40025 4.81346 4.24261 4.97114 4.04873 4.97114Z"
                        fill="#0074C3"
                      />
                      <path
                        d="M19.9062 14.403C18.9369 14.403 18.1484 15.1914 18.1484 16.1607C18.1484 17.1299 18.9369 17.9184 19.9062 17.9184C20.8754 17.9184 21.6639 17.1299 21.6639 16.1607C21.6639 15.1915 20.8754 14.403 19.9062 14.403ZM19.9062 16.5123C19.7123 16.5123 19.5546 16.3546 19.5546 16.1607C19.5546 15.9668 19.7123 15.8092 19.9062 15.8092C20.1 15.8092 20.2577 15.9668 20.2577 16.1607C20.2577 16.3546 20.1 16.5123 19.9062 16.5123Z"
                        fill="#0074C3"
                      />
                      <path
                        d="M22.8135 13.2977C21.2349 11.7191 18.6664 11.7191 17.0878 13.2977C15.7793 14.606 15.5241 16.6317 16.467 18.2238L18.7171 22.023H5.08711C3.88387 22.023 2.90494 21.0441 2.90494 19.8409C2.90494 18.6376 3.88383 17.6587 5.08711 17.6587H11.6894C13.668 17.6587 15.2778 16.0489 15.2778 14.0703C15.2778 12.0916 13.668 10.4819 11.6894 10.4819H5.2829L7.53295 6.68266C8.47584 5.0906 8.22056 3.0649 6.91223 1.75657C6.14751 0.991897 5.1308 0.570679 4.04934 0.570679C2.96789 0.570679 1.95112 0.991851 1.1864 1.75657C-0.121971 3.06494 -0.377205 5.09069 0.565686 6.68271L3.64861 11.8881H11.6894C12.8926 11.8881 13.8716 12.867 13.8716 14.0703C13.8716 15.2735 12.8927 16.2525 11.6894 16.2525H5.08711C3.10851 16.2525 1.49873 17.8623 1.49873 19.8409C1.49873 21.8195 3.10847 23.4292 5.08711 23.4292H20.3515L23.4344 18.2238C24.3772 16.6317 24.1219 14.606 22.8135 13.2977ZM1.77562 5.96618C1.16025 4.92705 1.32679 3.6049 2.18081 2.75098C2.67994 2.2518 3.3435 1.97698 4.0493 1.97698C4.75509 1.97698 5.41875 2.25185 5.91787 2.75098C6.7718 3.6049 6.93839 4.92705 6.32306 5.96618L4.04934 9.80529L1.77562 5.96618ZM22.2244 17.5072L19.9507 21.3463L17.6769 17.5072C17.0616 16.4681 17.2281 15.1459 18.0821 14.292C18.5973 13.7768 19.274 13.5193 19.9507 13.5193C20.6274 13.5193 21.3041 13.7769 21.8192 14.292C22.6732 15.1459 22.8398 16.4681 22.2244 17.5072Z"
                        fill="#0074C3"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_3301_17264">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </text>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TripProgressTracker;
