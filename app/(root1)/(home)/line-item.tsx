import { ReactNode } from "react";

export const LineItemOuterContainer = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <div className="px-4 sm:px-0">
      <div className="space-y-6 max-w-2xl">
        <div className="border-l-2 border-gray-300 dark:border-gray-600 pl-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export const LineItemContainer = ({
  children,
}: {
  children: ReactNode;
}) => {
  return <div className="mb-10">{children}</div>;
};

export const LineItemHeading = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <h3 className="text-xl font-semibold text-balance mb-2">{children}</h3>
  );
};

export const LineItemSubheading = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <p className="text-sm text-gray-600 dark:text-gray-300 text-balance mb-3">
      {children}
    </p>
  );
};

export const LineItemDescription = ({
  children,
}: {
  children: ReactNode;
}) => {
  return <p className="mt-3 text-sm sm:text-base text-balance">{children}</p>;
};
