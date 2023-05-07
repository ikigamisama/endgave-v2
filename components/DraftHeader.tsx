import {
  BackIcon,
  CharacterIcon,
  RestartIcon,
  SwapIcon,
  WinnerIcon,
} from "@/libs/includes/icons";
import {
  BanCharacterWrapper,
  BanCharactersListContainer,
  BanCharactersListWrapper,
  BossDraftContainer,
  BossDraftWrapper,
  BossNameWrapper,
} from "@/src/styles/Draft";
import {
  Box,
  Flex,
  FormControl,
  HStack,
  Image,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from "@chakra-ui/react";
import {
  BackToArenaProps,
  CharacterDraftProps,
  DraftInfoProps,
  ModalFeatures,
} from "@/libs/helpers/types";
import {
  EndgameModalContent,
  EndgameModalWrapper,
  ModalEndgameButton,
  ModalTextEndgame,
} from "@/src/styles/Modal";

import {
  banIndexListPlayer1,
  banIndexListPlayer2,
  inArray,
} from "@/libs/providers/draft";
import { ButtonPopUpNav, FontHeaderPopup } from "@/src/styles";
import { FormLabelText, FormSelect } from "@/src/styles/login";
import { SettingsIcon } from "@chakra-ui/icons";
import { useState } from "react";

const ModalFeatureDraft = ({
  isOpen,
  onClose,
  title,
  onAcceptButton,
}: ModalFeatures) => {
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />

      <EndgameModalContent>
        <EndgameModalWrapper>
          <ModalHeader></ModalHeader>
          <ModalBody>
            <ModalTextEndgame>{title}</ModalTextEndgame>
          </ModalBody>
          <ModalFooter>
            <ModalEndgameButton
              bgColor="#61B162"
              onClick={() => {
                if (onAcceptButton !== undefined) {
                  onAcceptButton();
                  onClose();
                }
              }}
              _hover={{
                bgColor: "#61B162",
                boxShadow: "0px 0px 16px 4px rgba(103, 228, 100, 1)",
              }}
            >
              OK
            </ModalEndgameButton>
            <ModalEndgameButton
              bgColor="#95292D"
              onClick={onClose}
              _hover={{
                bgColor: "#95292D",
                boxShadow: "0px 0px 16px 4px rgba(203, 53, 53, 1)",
              }}
            >
              Close
            </ModalEndgameButton>
          </ModalFooter>
        </EndgameModalWrapper>
      </EndgameModalContent>
    </Modal>
  );
};

const DraftHeader: React.FC<CharacterDraftProps> = ({
  onOpenCharacterModal,
  setBackgroundVid,
  state,
  router,
  ban,
  banWidth,
  boss,
  colorConvertVision,
  currentSequence,
  onAcceptRestartDraft,
  onAcceptSwitchPlayersDraft,
  socket,
  winnerButton,
  setPopupModalWinner,
}) => {
  const [modalRestartDraft, setModalRestartDraft] = useState<boolean>(false);
  const [modalSwitchDraft, setModalSwitchDraft] = useState<boolean>(false);

  const onCloseModalRestartDraft = () => {
    setModalRestartDraft(!modalRestartDraft);
  };

  const onCloseModalSwitchDraft = () => {
    setModalSwitchDraft(!modalSwitchDraft);
  };

  return (
    <>
      <ModalFeatureDraft
        isOpen={modalRestartDraft}
        onClose={onCloseModalRestartDraft}
        onAcceptButton={onAcceptRestartDraft}
        title="Are you sure to restart the draft"
      />

      <ModalFeatureDraft
        isOpen={modalSwitchDraft}
        onClose={onCloseModalSwitchDraft}
        onAcceptButton={onAcceptSwitchPlayersDraft}
        title="Are you sure to switch the players"
      />

      <Box as="nav" w="100%">
        {ban?.player1.length !== 0 && (
          <HStack
            px={10}
            w="100%"
            justifyContent="space-between"
            alignItems="center"
            gap={4}
          >
            <Flex flex={1} gap={4} justifyContent="flex-start">
              {state?.user.role === "GM" && (
                <ButtonPopUpNav
                  onClick={() =>
                    socket.emit("backArena", {
                      draft_id: router?.query.draftID,
                      arena_id: router?.query.arenaID,
                    })
                  }
                >
                  <BackIcon />
                </ButtonPopUpNav>
              )}
              {state?.user.role === "Drafter" && (
                <ButtonPopUpNav onClick={onOpenCharacterModal}>
                  <CharacterIcon />
                </ButtonPopUpNav>
              )}
            </Flex>
            <Flex flex={1} justifyContent="center">
              <BanCharactersListContainer
                width={`${(banWidth !== undefined ? banWidth : 0) + 25}px`}
                aligndraft="left"
                statusdraft={
                  currentSequence &&
                  inArray(currentSequence.index, banIndexListPlayer1) &&
                  currentSequence.player === "player1"
                    ? "true"
                    : "none"
                }
              >
                <BanCharactersListWrapper width={`${banWidth}px`}>
                  {ban?.player1?.map((banData: DraftInfoProps, pi: number) => (
                    <BanCharacterWrapper
                      aligndraft="left"
                      widthcharacter={banData.wrapperWidthSize}
                      colorcharacter={
                        banData.characterID !== null
                          ? colorConvertVision &&
                            colorConvertVision(banData.character.vision)
                          : ""
                      }
                      indexcharacter={banData.indexCharacter}
                      key={pi}
                    >
                      {banData.characterID !== null && (
                        <Image
                          src={banData.character.ban_picture}
                          w={banData.imageWidthSize}
                          alt={banData.index}
                        />
                      )}
                    </BanCharacterWrapper>
                  ))}
                </BanCharactersListWrapper>
              </BanCharactersListContainer>
              <BossDraftContainer>
                <BossDraftWrapper>
                  {boss !== null && (
                    <>
                      <Image
                        src={boss?.picture_flash}
                        w="100%"
                        alt="boss-draft"
                      />
                      <BossNameWrapper>{boss?.name}</BossNameWrapper>
                    </>
                  )}
                </BossDraftWrapper>
              </BossDraftContainer>
              <BanCharactersListContainer
                width={`${(banWidth !== undefined ? banWidth : 0) + 25}px`}
                aligndraft="right"
                statusdraft={
                  currentSequence &&
                  inArray(currentSequence.index, banIndexListPlayer2) &&
                  currentSequence.player === "player2"
                    ? "true"
                    : "none"
                }
              >
                <BanCharactersListWrapper width={`${banWidth}px`}>
                  {ban?.player2?.map((banData: DraftInfoProps, pi: number) => (
                    <BanCharacterWrapper
                      aligndraft="right"
                      widthcharacter={banData.wrapperWidthSize}
                      colorcharacter={
                        banData.characterID !== null
                          ? colorConvertVision &&
                            colorConvertVision(banData.character.vision)
                          : ""
                      }
                      indexcharacter={banData.indexCharacter}
                      key={pi}
                    >
                      {banData.characterID !== null && (
                        <Image
                          src={banData.character.ban_picture}
                          w={banData.imageWidthSize}
                          alt={banData.index}
                        />
                      )}
                    </BanCharacterWrapper>
                  ))}
                </BanCharactersListWrapper>
              </BanCharactersListContainer>
            </Flex>

            <Flex flex={1} gap={4} justifyContent="flex-end">
              {winnerButton === true && (
                <ButtonPopUpNav
                  onClick={() => {
                    if (setPopupModalWinner) {
                      setPopupModalWinner(true);
                    }
                  }}
                >
                  <WinnerIcon />
                </ButtonPopUpNav>
              )}

              <Box>
                <Popover placement="bottom-start">
                  <PopoverTrigger>
                    <ButtonPopUpNav>
                      <SettingsIcon boxSize={7} />
                    </ButtonPopUpNav>
                  </PopoverTrigger>
                  <PopoverContent bgColor="#1e223f">
                    <FontHeaderPopup fontWeight="semibold" p={4}>
                      Settings
                    </FontHeaderPopup>
                    <PopoverArrow />

                    <PopoverBody px={4} pb={5}>
                      <FormControl>
                        <FormLabelText>Background Video</FormLabelText>
                        <FormSelect
                          placeContent="random"
                          value={state?.settings.video_bg.mp4
                            .replace("/video/bg/", "")
                            .replace("_bg.mp4", "")}
                          onChange={(e) => {
                            if (setBackgroundVid) {
                              setBackgroundVid({
                                mp4: "/video/bg/" + e.target.value + "_bg.mp4",
                                webm:
                                  "/video/bg/" + e.target.value + "_bg.webm",
                              });
                            }
                          }}
                        >
                          <option value="stars">Default</option>
                          <option value="anemo">Anemo</option>
                          <option value="cryo">Cryo</option>
                          <option value="dendro">Dendro</option>
                          <option value="electro">Electro</option>
                          <option value="geo">Geo</option>
                          <option value="hydro">Hydro</option>
                          <option value="pyro">Pyro</option>
                        </FormSelect>
                      </FormControl>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </Box>

              {state?.user.role === "GM" && (
                <>
                  <ButtonPopUpNav
                    onClick={() => {
                      setModalRestartDraft(true);
                    }}
                  >
                    <RestartIcon />
                  </ButtonPopUpNav>
                  <ButtonPopUpNav
                    onClick={() => {
                      setModalSwitchDraft(true);
                    }}
                  >
                    <SwapIcon />
                  </ButtonPopUpNav>
                </>
              )}
            </Flex>
          </HStack>
        )}
      </Box>
    </>
  );
};

export default DraftHeader;
