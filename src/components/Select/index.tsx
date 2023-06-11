import {
    CheckIcon,
    ChevronDownIcon,
    ChevronUpIcon,
  } from "@radix-ui/react-icons";
  import * as SelectPrimitive from "@radix-ui/react-select";
  import { clsx } from "clsx";
  import React from "react";
//   import Button from "./shared/button";
  
  type SelectProps = {};
  
  const Select = ({value,table}:any) => {
    console.log(value)
    return (
      <SelectPrimitive.Root defaultValue={'10'} onValueChange={(e)=>table.setPageSize(Number(e))}>
        <SelectPrimitive.Trigger asChild aria-label="Food" >
          <Button>
            <SelectPrimitive.Value />
            <SelectPrimitive.Icon className="ml-2">
              <ChevronDownIcon />
            </SelectPrimitive.Icon>
          </Button>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Content>
          <SelectPrimitive.ScrollUpButton className="flex items-center justify-center text-gray-700 dark:text-gray-300">
            <ChevronUpIcon />
          </SelectPrimitive.ScrollUpButton>
          <SelectPrimitive.Viewport className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg">
            <SelectPrimitive.Group>
              {["10", "20", "30", "40", "50"].map(
                (f, i) => (
                  <SelectPrimitive.Item
                    // disabled={f === "Grapes"}
                    key={`${f}-${i}`}
                     value={f}
                    //  value={value}
                    className={clsx(
                      "relative flex items-center px-8 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 font-medium focus:bg-gray-100 dark:focus:bg-gray-900",
                      "radix-disabled:opacity-50",
                      "focus:outline-none select-none"
                    )}
                  >
                    <SelectPrimitive.ItemText>{f}</SelectPrimitive.ItemText>
                    <SelectPrimitive.ItemIndicator className="absolute left-2 inline-flex items-center">
                      <CheckIcon />
                    </SelectPrimitive.ItemIndicator>
                  </SelectPrimitive.Item>
                )
              )}
            </SelectPrimitive.Group>
          </SelectPrimitive.Viewport>
          <SelectPrimitive.ScrollDownButton className="flex items-center justify-center text-gray-700 dark:text-gray-300">
            <ChevronDownIcon />
          </SelectPrimitive.ScrollDownButton>
        </SelectPrimitive.Content>
      </SelectPrimitive.Root>
    );
  };
  
  export { Select };
  

  type Props = Omit<React.ComponentProps<"button">, "className"> & {};

const Button = React.forwardRef<HTMLButtonElement, Props>(
  ({ children, ...props }, ref) => (
    <button
      ref={ref}
      {...props}
      className={clsx(
        "inline-flex select-none items-center justify-center rounded-md px-4 py-2 text-sm font-medium",
        "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-900",
        "hover:bg-gray-50",
        "focus:outline-none focus-visible:ring focus-visible:ring-purple-500 focus-visible:ring-opacity-75",
        // Register all radix states
        "group",
        "radix-state-open:bg-gray-50 dark:radix-state-open:bg-gray-900",
        "radix-state-on:bg-gray-50 dark:radix-state-on:bg-gray-900",
        "radix-state-instant-open:bg-gray-50 radix-state-delayed-open:bg-gray-50"
      )}
    >
      {children}
    </button>
  )
);

Button.displayName = "Button";
export default Button;
