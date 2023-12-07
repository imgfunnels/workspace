import { useToast as useChakraToast} from "@chakra-ui/react";

export default function useToast() {
  const toast = useChakraToast();
  return ({
    message = "",
    status = "success",
    variant = "left-accent",
    duration = 9000,
    isClosable = true,
  }) =>
    toast({
      description: message,
      status,
      variant,
      duration,
      isClosable,
    });
}
