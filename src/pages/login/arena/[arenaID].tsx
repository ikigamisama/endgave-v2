import Head from "next/head";
import { LoginImageLogo } from "@/libs/includes/image";
import { userStore } from "@/libs/providers/UserContext";
import { CenterBox, ToastBox, ToastText } from "@/src/styles";
import {
  AvatarCircle,
  AvatarName,
  AvatarNameWrapper,
} from "@/src/styles/Arena";
import {
  FormLabelText,
  FormSelect,
  FormSubmitButton,
  FormTextBox,
  LoginCard,
  LoginCardWrapper,
} from "@/src/styles/login";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {
  Box,
  Center,
  FormControl,
  Image,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { avatarList } from "@/libs/includes/avatars";
import { PlayerLoginProps } from "@/libs/helpers/types";
import BackgroundVid from "@/components/BackgroundVid";
import { NextPage } from "next";
import { signIn } from "next-auth/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import { api } from "@/libs/providers/api";
import { useMutation } from "@tanstack/react-query";
import { video_list } from "@/libs/includes/videos";
import { socket } from "@/libs/providers/socket";
import Footer from "@/components/Footer";

const ArenaPlayerLogin: NextPage = () => {
  const router = useRouter();
  const toast = useToast();
  const { handleSubmit, control, watch } = useForm<PlayerLoginProps>({
    defaultValues: {
      team_name: "",
      avatar: "",
      role: "Drafter",
    },
  });
  const [setArenaID, isLoadingSubmit, setLoadingSubmit, setUserData] =
    userStore((state) => [
      state.setArenaID,
      state.isLoadingSubmit,
      state.setLoadingSubmit,
      state.setUserData,
    ]);
  const authCheck = useMutation({
    mutationFn: async (data: PlayerLoginProps) => {
      let submitResponse = await api.post("/account/player/login", data);
      return submitResponse.data;
    },
    onSuccess: async (data) => {
      if (data.success) {
        toast({
          position: "top-right",
          render: () => (
            <ToastBox
              px={8}
              py={6}
              display="flex"
              flexDirection="row"
              alignItems="center"
              gap={4}
              borderLeft="10px solid #61b162"
            >
              <CheckCircleIcon boxSize={5} />
              <ToastText>{data.message}</ToastText>
            </ToastBox>
          ),
          duration: 3000,
          isClosable: true,
        });
        socket.emit("newArenaPlayers", data.socket);

        const res = await signIn("credentials", {
          username: data.result.username,
          avatar: data.result.avatar,
          role: data.result.role,
          redirect: false,
        });

        setLoadingSubmit(false);

        if (res?.ok) {
          localStorage.setItem(
            "user_session",
            JSON.stringify({
              id: data.result.id,
              username: data.result.username,
              avatar: data.result.avatar,
              role: data.result.role,
              arenaPlayer: data.socket.arenaPlayers,
            })
          );

          setUserData(data.result);
          setArenaID(router.query?.arenaID);
          router.replace(`/arena/${router.query?.arenaID}`);
        }
      }
    },
  });

  const watchTeamName: any = watch("team_name"),
    watchAvatar: any = watch("avatar");

  const submitPlayerLogin: SubmitHandler<PlayerLoginProps> = async (data) => {
    setLoadingSubmit(true);
    authCheck.mutate({ ...data, arenaID: router.query.arenaID });
  };
  return (
    <>
      <Head>
        <title>Endgame - Player Login</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <BackgroundVid
        mp4={video_list["Default"].mp4}
        webm={video_list["Default"].webm}
      />

      <Box position="relative" h="calc(100vh - 66px)">
        <CenterBox>
          <LoginCard>
            <LoginCardWrapper>
              <Center mb="75px">
                <Image src={LoginImageLogo} w="400px" alt="login-image" />
              </Center>
              <form method="post" onSubmit={handleSubmit(submitPlayerLogin)}>
                <FormControl mb="25px">
                  <FormLabelText>Team Name</FormLabelText>
                  <Controller
                    render={({ field: { onChange, value, name } }) => (
                      <FormTextBox
                        type="text"
                        onChange={onChange}
                        value={value}
                        name={name}
                        required
                      />
                    )}
                    name="team_name"
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
                        required
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

                <FormControl mb="50px">
                  <FormLabelText>Preview</FormLabelText>
                  <Box position="relative">
                    <AvatarCircle>
                      <Image
                        src={
                          watchAvatar !== ""
                            ? watchAvatar
                            : "https://api.dicebear.com/6.x/adventurer/svg?seed=Baby"
                        }
                        alt="avatar"
                        width="100%"
                      />
                    </AvatarCircle>
                    <AvatarNameWrapper>
                      <AvatarName>{watchTeamName}</AvatarName>
                    </AvatarNameWrapper>
                  </Box>
                </FormControl>

                <FormSubmitButton type="submit">
                  {isLoadingSubmit === true ? (
                    <Spinner
                      thickness="5px"
                      speed="0.5s"
                      emptyColor="#ECDEB5"
                      color="#1E223F"
                    />
                  ) : (
                    " Join Room"
                  )}
                </FormSubmitButton>
              </form>
            </LoginCardWrapper>
          </LoginCard>
        </CenterBox>
      </Box>

      <Footer />
    </>
  );
};

export default ArenaPlayerLogin;
