import { useEffect } from "react"; // Added import for useEffect
import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type SubmitHandler, useForm } from "react-hook-form";

import {
  type ApiError,
  type UserPublic,
  type UserUpdate as BaseUserUpdate,
  UsersService,
} from "../../client";
import useCustomToast from "../../hooks/useCustomToast";
import { emailPattern, handleError } from "../../utils";

// Define subscription settings structure
interface SubscriptionSettings {
  serp?: {
    hasSubscription: boolean;
    isTrial: boolean;
    isDeactivated: boolean;
  };
}

// Extend the base UserUpdate type
interface UserUpdate extends BaseUserUpdate {
  subscription_settings?: SubscriptionSettings;
}

// Extend UserPublic for the component props
interface ExtendedUserPublic extends UserPublic {
  subscription_settings?: SubscriptionSettings;
}

interface EditUserProps {
  user: ExtendedUserPublic;
  isOpen: boolean;
  onClose: () => void;
}

interface UserUpdateForm extends UserUpdate {
  confirm_password: string;
  has_serp_subscription?: boolean;
  is_serp_trial?: boolean;
  is_serp_deactivated?: boolean;
}

const EditUser = ({ user, isOpen, onClose }: EditUserProps) => {
  const queryClient = useQueryClient();
  const showToast = useCustomToast();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UserUpdateForm>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      ...user,
      has_serp_subscription: user.subscription_settings?.serp?.hasSubscription || false,
      is_serp_trial: user.subscription_settings?.serp?.isTrial || false,
      is_serp_deactivated: user.subscription_settings?.serp?.isDeactivated || false,
    },
  });

  // Sync form with user prop changes
  useEffect(() => {
    reset({
      ...user,
      has_serp_subscription: user.subscription_settings?.serp?.hasSubscription || false,
      is_serp_trial: user.subscription_settings?.serp?.isTrial || false,
      is_serp_deactivated: user.subscription_settings?.serp?.isDeactivated || false,
    });
  }, [user, reset]);

  const mutation = useMutation({
    mutationFn: (data: UserUpdateForm) => {
      const requestData: UserUpdate = {
        ...data,
        subscription_settings: {
          serp: {
            hasSubscription: data.has_serp_subscription || false,
            isTrial: data.is_serp_trial || false,
            isDeactivated: data.is_serp_deactivated || false,
          },
        },
      };
      delete (requestData as any).confirm_password;
      delete (requestData as any).has_serp_subscription;
      delete (requestData as any).is_serp_trial;
      delete (requestData as any).is_serp_deactivated;

      return UsersService.updateUser({
        userId: user.id,
        requestBody: requestData,
      });
    },
    onSuccess: () => {
      showToast("Success!", "User updated successfully.", "success");
      onClose();
    },
    onError: (err: ApiError) => {
      handleError(err, showToast);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const onSubmit: SubmitHandler<UserUpdateForm> = async (data) => {
    if (data.password === "") {
      data.password = undefined;
    }
    mutation.mutate(data);
  };

  const onCancel = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size={{ base: "sm", md: "md" }}
      isCentered
    >
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
        <ModalHeader>Edit User</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl isInvalid={!!errors.email}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              {...register("email", {
                required: "Email is required",
                pattern: emailPattern,
              })}
              placeholder="Email"
              type="email"
            />
            {errors.email && (
              <FormErrorMessage>{errors.email.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl mt={4}>
            <FormLabel htmlFor="name">Full name</FormLabel>
            <Input id="name" {...register("full_name")} type="text" />
          </FormControl>
          <FormControl mt={4} isInvalid={!!errors.password}>
            <FormLabel htmlFor="password">Set Password</FormLabel>
            <Input
              id="password"
              {...register("password", {
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              placeholder="Password"
              type="password"
            />
            {errors.password && (
              <FormErrorMessage>{errors.password.message}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl mt={4} isInvalid={!!errors.confirm_password}>
            <FormLabel htmlFor="confirm_password">Confirm Password</FormLabel>
            <Input
              id="confirm_password"
              {...register("confirm_password", {
                validate: (value) =>
                  value === getValues().password || "The passwords do not match",
              })}
              placeholder="Password"
              type="password"
            />
            {errors.confirm_password && (
              <FormErrorMessage>{errors.confirm_password.message}</FormErrorMessage>
            )}
          </FormControl>
          <Flex gap={4} mt={4}>
            <FormControl>
              <Checkbox {...register("is_superuser")} colorScheme="teal">
                Is superuser?
              </Checkbox>
            </FormControl>
            <FormControl>
              <Checkbox {...register("is_active")} colorScheme="teal">
                Is active?
              </Checkbox>
            </FormControl>
          </Flex>
          <Flex direction="column" mt={4} gap={2}>
            <FormControl>
              <Checkbox {...register("has_serp_subscription")} colorScheme="teal">
                Has SERP Tool
              </Checkbox>
            </FormControl>
            <FormControl>
              <Checkbox {...register("is_serp_trial")} colorScheme="teal">
                Is SERP Trial
              </Checkbox>
            </FormControl>
            <FormControl>
              <Checkbox {...register("is_serp_deactivated")} colorScheme="teal">
                Is SERP Deactivated
              </Checkbox>
            </FormControl>
          </Flex>
        </ModalBody>
        <ModalFooter gap={3}>
          <Button
            variant="primary"
            type="submit"
            isLoading={isSubmitting}
            isDisabled={!isDirty}
          >
            Save
          </Button>
          <Button onClick={onCancel}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditUser;