import { ProfileChanges } from "@/libs/helpers/types";
import { avatarList } from "@/libs/includes/avatars";
import { api } from "@/libs/providers/api";
import { generatePassword } from "@/libs/providers/password";
import { useSettingsStore } from "@/libs/store/settings";
import { ToastText } from "@/src/styles";
import {
  GeneratePasswordButton,
  SettingsProfileAvatarWrapper,
} from "@/src/styles/Settings";
import {
  FormLabelText,
  FormSelect,
  FormSubmitButton,
  FormTextBox,
} from "@/src/styles/login";
import { CheckCircleIcon } from "@chakra-ui/icons";
import {
  Box,
  Center,
  Flex,
  FormControl,
  Image,
  SimpleGrid,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { shallow } from "zustand/shallow";

const Account: React.FC = () => {
  const toast = useToast();
  const queryclient = useQueryClient();
  const [isGeneratePassword, applyGeneratePassword] = useSettingsStore(
    (state) => [state.isGeneratePassword, state.applyGeneratePassword],
    shallow
  );

  const { handleSubmit, control, watch, setValue, reset } =
    useForm<ProfileChanges>({
      defaultValues: {
        id: "",
        username: "",
        role: "",
        avatar: "",
        password: "",
        confirm_password: "",
      },
    });

  const sendAddAccount = useMutation({
    mutationFn: async (newAccount: ProfileChanges) => {
      const submitResponse = await api.post("/account/addAccount", newAccount);
      return submitResponse.data;
    },
    onSuccess: (data) => {
      toast({
        position: "top-right",
        render: () => (
          <Box
            bgColor="#1E223F"
            p={4}
            display="flex"
            flexDirection="row"
            alignItems="center"
            gap={4}
          >
            <CheckCircleIcon boxSize={5} />
            <ToastText>{data.message}</ToastText>
          </Box>
        ),
        duration: 3000,
        isClosable: true,
      });
      if (data.success) {
        applyGeneratePassword(false);
        reset({
          id: "",
          username: "",
          role: "",
          avatar: "",
          password: "",
        });
        queryclient.invalidateQueries(["userList"]);
      }
    },
  });

  const onSubmitProfile: SubmitHandler<ProfileChanges> = (data) => {
    sendAddAccount.mutate(data);
  };

  const watchAvatar: any = watch("avatar"),
    watchRole: any = watch("role");

  return (
    <Box as="section" py={4}>
      <form method="post" onSubmit={handleSubmit(onSubmitProfile)}>
        <SimpleGrid columns={2} spacing={10} mb={4}>
          <Flex flex={1} direction="column">
            <FormControl mb="25px">
              <FormLabelText>Name</FormLabelText>
              <Controller
                render={({ field: { onChange, value, name } }) => (
                  <FormTextBox
                    type="text"
                    onChange={onChange}
                    value={value}
                    name={name}
                    required={true}
                  />
                )}
                name="username"
                control={control}
              />
            </FormControl>
            <FormControl mb="25px">
              <FormLabelText>Role</FormLabelText>
              <Controller
                render={({ field: { onChange, value, name } }) => (
                  <FormSelect
                    placeholder="Select Role"
                    onChange={onChange}
                    value={value}
                    name={name}
                    required={true}
                  >
                    <option value="GM">GM</option>
                    <option value="Drafter">Drafter</option>
                  </FormSelect>
                )}
                name="role"
                control={control}
              />
            </FormControl>
            <FormControl mb="25px">
              <FormLabelText>Avatar</FormLabelText>
              <Controller
                render={({ field: { onChange, value, name } }) => (
                  <FormSelect
                    placeContent="Select Avatar"
                    onChange={onChange}
                    value={value}
                    name={name}
                    required={true}
                  >
                    {avatarList.map((data, d) => (
                      <option key={d} value={data.img}>
                        {data.name}
                      </option>
                    ))}
                  </FormSelect>
                )}
                name="avatar"
                control={control}
              />
            </FormControl>
          </Flex>
          <Flex flex={1} direction="column">
            <Center>
              <SettingsProfileAvatarWrapper>
                <Image
                  src={
                    watchAvatar !== ""
                      ? watchAvatar
                      : "https://api.dicebear.com/6.x/adventurer/svg?seed=Baby"
                  }
                  alt="avatar"
                  width="100%"
                />
              </SettingsProfileAvatarWrapper>
            </Center>
          </Flex>
        </SimpleGrid>
        {watchRole === "GM" && (
          <>
            <GeneratePasswordButton
              onClick={() => {
                const genPass = generatePassword();
                setValue("password", genPass);
                applyGeneratePassword(true);
              }}
            >
              Generate Password
            </GeneratePasswordButton>
            <FormControl mb="25px">
              <FormLabelText>Password</FormLabelText>
              <Controller
                render={({ field: { onChange, value, name } }) => (
                  <FormTextBox
                    type={isGeneratePassword === true ? "text" : "password"}
                    onChange={onChange}
                    value={value}
                    name={name}
                    required={true}
                  />
                )}
                name="password"
                control={control}
              />
            </FormControl>
          </>
        )}

        <FormSubmitButton type="submit" disabled={sendAddAccount.isLoading}>
          Create Account
        </FormSubmitButton>
      </form>
    </Box>
  );
};

export default Account;
