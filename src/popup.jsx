import React, { useEffect, useState } from "react";
import ReactDOM from 'react-dom/client'
import {
    Box, Heading, HStack, VStack, Flex, IconButton, Text, Icon, Avatar, Tag,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Popover,
    PopoverAnchor,
    Button,
    PopoverArrow,
    PopoverBody,
    PopoverContent,
    AvatarBadge,
    PopoverCloseButton,
    PopoverTrigger,
    PopoverHeader,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    RadioGroup,
    Stack,
    Radio,
    DrawerContent,
    DrawerCloseButton,
    useDisclosure,
    Input,
    Link,
    SimpleGrid,
    GridItem,
    Modal,
    ModalOverlay,
    ModalContent,
    Spinner,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Textarea,
    Image

} from "@chakra-ui/react";
import { ChakraProvider } from '@chakra-ui/react'
import { HiOutlineHome } from 'react-icons/hi'
import { BsThreeDotsVertical } from 'react-icons/bs'
import { RiDraftLine, RiAddLine } from 'react-icons/ri'
import { MdFilterList } from 'react-icons/md'
import { AiTwotoneFolderOpen } from 'react-icons/ai'
import axios from "axios";

function Popup() {
    const [Code, SetCode] = useState('')
    const [AccessToken, setAccessToken] = useState('')
    const posts = [{ name: "Abhinav's space" }, { name: "Aayush's space" }]
    const [Error, SetError] = useState('')
    const [Teams, SetTeams] = useState([])
    const [CurrentTeamAvatar, setCurrentTeamAvatar] = useState('')
    const [currentTeam, setCurrentTeam] = useState('')
    const [currentSpace, setCurrentSpace] = useState('')
    const [Spaces, SetSpaces] = useState([])
    const [Folders, SetFolders] = useState([])
    const [currentList, setCurrentList] = useState('')
    const [currentFolder, setCurrentFolder] = useState('')
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [globalList, setglobalList] = useState('')
    const { isOpen: GloabalIsOpen, onOpen: GloabalOnOpen, onClose: GlobalOnClose } = useDisclosure()

    const btnRef = React.useRef()


    const [Lists, SetLists] = useState([])
    const [Tasks, SetTasks] = useState([])

    useEffect(() => {
        if (globalList.length > 0) {
            chrome.storage.sync.set({ 'global_list': globalList })
        }
    }, [globalList.length])


    const gradients = [
        {
            backgroundColor: "#4158D0",
            backgroundImage: "linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)"

        },
        {
            backgroundColor: "#0093E9",
            backgroundImage: "linear-gradient(160deg, #0093E9 0%, #80D0C7 100%)"

        },
        {
            backgroundColor: "#FFFFFF",
            backgroundImage: "linear-gradient(180deg, #FFFFFF 0%, #6284FF 50%, #FF0000 100%)"
        },
        {
            backgroundColor: "#D9AFD9",
            backgroundImage: "linear-gradient(0deg, #D9AFD9 0%, #97D9E1 100%)"
        }

    ]


    chrome.storage.sync.get('global_list', function (global_list) {
        if (global_list.global_list) {
            setglobalList(global_list.global_list)
        }
        else {
            setglobalList('')
        }
    })


    chrome.storage.sync.get('code', function (code) {
        if (code.code) {
            SetCode(code.code)
            GetMyAccessToken(code.code)
        }
        else {

        }

    })

    chrome.storage.sync.get('access_token', function (access_token) {
        if (access_token) {
            setAccessToken(access_token.access_token)
            chrome.storage.local.set({ "local_token": { local_token: access_token.access_token } })
        }
        else if (Code.length > 0) {
            GetMyAccessToken(Code)
        }
    })

    chrome.storage.sync.get('fav', function (fav) {

    })



    const GetMyAccessToken = async (Code) => {
        if (AccessToken === '') {


            const data = await fetch(`https://api.clickup.com/api/v2/oauth/token?client_id=BZZXK4XXFJY7N4W2DUHC51GJUXXTZJV6&client_secret=NNTF60UY0728Z2XPM0YXKJGCVQIHFP69A1TTV2UGJWYMNPU9B60C5MAFTFI8T3NL&code=${Code}`, {
                method: 'POST',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const jdata = await data.json()
            chrome.storage.sync.set({ 'access_token': jdata.access_token })
        }
    }

    const ShowChangedList = () => {
        
    }

    useEffect(() => {
        if (AccessToken !== '') {
            const GetMyteams = async () => {

                const data = await fetch("https://api.clickup.com/api/v2/team", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": AccessToken
                    }
                })

                const jdata = await data.json()

                SetTeams(jdata.teams)

            }
            GetMyteams()
        }
    }, [AccessToken])

    const setCurrentTeamWithGoogle = (id) => {
        if (id) {
            chrome.storage.sync.set({ 'team': id })

            let av = Teams?.find(item => item.id === id)
            setCurrentTeamAvatar(av.avatar)
        }
    }

    chrome.storage.sync.get('team', function (team_id) {
        if (typeof (team_id) !== undefined) {
            setCurrentTeam(team_id.team)

            let av = Teams?.find(item => item.id === team_id.team)
            setCurrentTeamAvatar(av?.avatar)
        }
        else {
            setCurrentTeam("")
        }
    })

    useEffect(() => {
        const GetMySpaces = async () => {
            if (currentTeam !== '') {
                const data = await fetch(`https://api.clickup.com/api/v2/team/${currentTeam}/space`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": AccessToken
                    }
                })
                const jdata = await data.json()
                SetSpaces(jdata.spaces)
            }

        }
        GetMySpaces()
    }, [currentTeam])

    useEffect(() => {
        if (currentSpace !== '') {
            const GetMyFolders = async () => {

                const data = await fetch(`https://api.clickup.com/api/v2/space/${currentSpace}/folder`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": AccessToken
                    }
                })
                const jdata = await data.json()
                SetFolders(jdata.folders)

            }
            GetMyFolders()
        }
    }, [currentSpace])

    const GetMyTasks = async (currentList) => {

        const data = await fetch(`https://api.clickup.com/api/v2/list/${currentList}/task`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": AccessToken
            }
        })
        const jdata = await data.json()


        let tasks = jdata.tasks


        var fil = []
        tasks.map((element) => {
            element.tags?.map(element2 => {
                if (element2.name === 'linkedin') {
                    fil.push(element)
                }
            });
        })
        SetTasks(fil)

    }


    useEffect(() => {
        if (AccessToken) {
            const GetMyteams = async () => {

                try {
                    const data = axios.get("https://api.clickup.com/api/v2/team", {
                        headers: {
                            'Content-Type': 'application/json',
                            "Authorization": AccessToken
                        }
                    })
                    SetTeams(data.teams)

                } catch (error) {
                    SetError(error.message)
                }

            }
            GetMyteams()
        }
    }, [AccessToken])

    return (
        <VStack margin={0} padding={0} borderRadius={'5px'} w="500px" h="700px">
            <VStack spacing={10} p={6} w="100%" h="100%">
                <HStack w="100%" h="10%" alignItems={'center'}>
                    <VStack
                        spacing={1}
                        alignItems={'flex-start'} w="80%" h="100%">
                        <Heading size={'xl'} fontWeight={700} fontFamily={'monospace'}>
                            {
                                globalList !== '' ? (
                                    "Saved posts"
                                ) : (
                                    <Text fontWeight={600}>
                                        Select a list
                                    </Text>
                                )
                            }

                        </Heading>
                        {
                            globalList !== '' ? (
                                <HStack spacing={1}>
                                    <Text fontSize={'13px'} fontWeight={700} fontFamily={'monospace'}>
                                        4 posts inside
                                    </Text>
                                    <Text fontSize={'13px'} fontWeight={700} fontFamily={'monospace'} textDecoration={'underline'}>
                                        list
                                    </Text>
                                </HStack>
                            ) : (<Text>
                                Segregate your LinkedIn posts
                            </Text>)
                        }

                    </VStack>

                    <Flex
                        alignItems={'center'} justifyContent={'center'} w="20%" h="100%">
                        <Popover>
                            <PopoverTrigger>
                                <Avatar src={CurrentTeamAvatar} cursor={'pointer'} />
                            </PopoverTrigger>
                            <PopoverContent w="max-content">
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverHeader>Select team</PopoverHeader>
                                <PopoverBody>
                                    <VStack w="100%" spacing={3}>
                                        {
                                            Teams && Teams.length > 0 ? (
                                                Teams?.map((item, i) => (
                                                    <Box spacing={3} key={i}>
                                                        <Avatar
                                                            key={i}
                                                            src={item.avatar}
                                                            cursor={'pointer'} size={'sm'}>
                                                            <AvatarBadge boxSize='1.25em' bg='green.500' />
                                                        </Avatar>
                                                        <Button
                                                            bg="white"
                                                            size={'sm'}
                                                            onClick={() => setCurrentTeamWithGoogle(item.id)}
                                                            _hover={{ bg: 'purple.400', color: 'white' }}
                                                        >
                                                            {item.name}
                                                        </Button>
                                                    </Box>
                                                ))
                                            ) : (<Box>
                                                No teams
                                            </Box>)

                                        }
                                        <Button onClick={() => { chrome.storage.sync.clear() }} bg="purple.400" size={'xs'} color="white">
                                            Logout
                                        </Button>
                                    </VStack>
                                </PopoverBody>
                            </PopoverContent>
                        </Popover>

                    </Flex>


                </HStack>

                {
                    globalList !== '' ? (
                        <Accordion
                            allowToggle
                            overflow={'scroll'} h="480px" w="100%">
                            {Spaces?.map((item, i) => (
                                <AccordionItem
                                    onClick={() => { setCurrentSpace(item.id) }}
                                    borderTop={'none'}
                                    borderColor={'gray.100'}
                                    key={i} w="100%">
                                    <h2>
                                        <AccordionButton>
                                            <Box flex='1' textAlign='left'>
                                                <Text
                                                    fontSize={'25px'}
                                                    fontWeight={700} fontFamily={'monospace'}>
                                                    {item.name}
                                                </Text>
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                    </h2>
                                    <AccordionPanel
                                        h={'max-content'}
                                        bg={'purple.50'}
                                        bgImage={"url('/twirl.png')"}
                                        bgPosition="right"
                                        bgSize={'100%'}
                                        bgRepeat="no-repeat"
                                        pb={4}>
                                        <VStack w="100%" h="100%">
                                            <Box w="100%" h="95%" bg="white">
                                                {
                                                    Folders && Folders.length > 0 ? (
                                                        Folders?.map((item, i) => (
                                                            <Box key={i}>

                                                                <VStack py={3} alignItems={'flex-start'} px={3}>

                                                                    <Link
                                                                        color={'purple.400'}
                                                                        fontFamily={'monospace'}
                                                                        fontWeight={700} fontSize={'lg'}>
                                                                        <Icon as={AiTwotoneFolderOpen} w={3} h={3} /> {item.name}
                                                                    </Link>
                                                                    <Text
                                                                        color={'purple.400'}
                                                                        fontFamily={'monospace'}
                                                                        fontWeight={700}
                                                                        fontSize={'15px'}
                                                                    >
                                                                        <Icon as={MdFilterList} w={3} h={3} /> Lists:
                                                                    </Text>

                                                                    {
                                                                        item.lists && item.lists.length > 0 ? (
                                                                            item.lists?.map((item2, i) => (
                                                                                <HStack w="100%" key={i}>

                                                                                    <Link
                                                                                        color={'purple.400'}
                                                                                        fontFamily={'monospace'}
                                                                                        fontWeight={700}
                                                                                        ref={btnRef}
                                                                                        fontSize={'13px'}
                                                                                        onClick={() => { setCurrentList(item2.id); setCurrentFolder(item.id); GetMyTasks(item2.id), onOpen() }}
                                                                                        px={5}
                                                                                    >
                                                                                        {item2.name}
                                                                                    </Link>

                                                                                    {
                                                                                        globalList === item2.id ? (
                                                                                            null
                                                                                        ) : (
                                                                                            <RadioGroup 
                                                                                            onClick={()=>{ShowChangedList}}
                                                                                            onChange={() => chrome.storage.sync.set({ "global_list": item2.id })} >
                                                                                                <Stack direction='row'>
                                                                                                    <Radio value={item2.id}></Radio>
                                                                                                </Stack>
                                                                                            </RadioGroup>
                                                                                        )
                                                                                    }
                                                                                </HStack>
                                                                            ))
                                                                        ) : (<Box>
                                                                            No lists
                                                                        </Box>)


                                                                    }

                                                                </VStack>

                                                            </Box>
                                                        ))
                                                    ) : (<Box>
                                                        No folders</Box>)
                                                }
                                                <Drawer
                                                    isOpen={isOpen}
                                                    placement='bottom'
                                                    onClose={onClose}
                                                    finalFocusRef={btnRef}
                                                >
                                                    <DrawerOverlay />
                                                    <DrawerContent h="700px">


                                                        <DrawerBody>
                                                            <Accordion allowToggle h={'max-content'} overflow={'scroll'}>
                                                                {
                                                                    Tasks && Tasks.length > 0 ? (
                                                                        Tasks?.map((item, i) => {

                                                                            var imageContainer = item?.description?.split('<---Images--->')[1]
                                                                            var images = imageContainer?.match(/<img[^>]*>/g)
                                                                            var profilePhoto = images?.find(item => item.includes('avatar'))?.replace(/&amp;/g, '&').split('"')[1]?.split('"')[0]

                                                                            var posts = images?.filter((z, j) => {

                                                                                if (z.includes('feed-shared-actor__avatar-image')) return null;
                                                                                if (z.includes('profile photo')) return null
                                                                                if(z.includes('EntityPhoto-circle')) return null

                                                                                else return z


                                                                            })
                                                                            
                                                                            var videosContainer = item?.description?.split('<---Videos--->')[1]
                                                                            var vids = videosContainer?.match(/<video[^>]*>/g)
                                                                           

                                                                            return (


                                                                                <AccordionItem borderTop={'0px'} py={3} key={i}>
                                                                                    <h2>
                                                                                        <AccordionButton>
                                                                                            <HStack flex='1' textAlign='left'>

                                                                                                <Tag
                                                                                                    w="11%"
                                                                                                    h="90%"
                                                                                                    borderRadius={'300px'}
                                                                                                    bg={gradients[Math.floor(Math.random() * gradients.length)].backgroundColor}
                                                                                                    bgImage={gradients[Math.floor(Math.random() * gradients.length)].backgroundImage}
                                                                                                    border={'5px solid white'}

                                                                                                >{""}</Tag>
                                                                                                <Avatar
                                                                                                    size={'sm'}
                                                                                                    key={i}
                                                                                                    src={profilePhoto} alt="ok" />

                                                                                                <Text fontWeight={800} fontFamily={'monospace'}>
                                                                                                    {item.name}
                                                                                                </Text>



                                                                                            </HStack>
                                                                                            <AccordionIcon />
                                                                                        </AccordionButton>
                                                                                    </h2>
                                                                                    <AccordionPanel h={'max-content'} pb={4}>
                                                                                        <Flex
                                                                                            bg="gray.50"
                                                                                            flexDirection={'column'}
                                                                                            paddingBottom={3} w="100%" alignItems={'center'} justifyContent={'center'}>
                                                                                            {
                                                                                                posts && posts.length > 0 ? (
                                                                                                    posts?.map((im, i) => {

                                                                                                        return (
                                                                                                            <Image w="100%" src={im?.replace(/&amp;/g, '&').split('src="')[1]?.split('"')[0]} key={i} alt="ko" />
                                                                                                        )
                                                                                                    })

                                                                                                ) : (null)
                                                                                            }
                                                                                            {
                                                                                               vids && vids.length > 0 ? (
                                                                                                vids?.map((vi, i) => {

                                                                                                    return (
                                                                                                        <video w="100%" src={vi?.replace(/&amp;/g, '&').split('src="')[1]?.split('"')[0]} key={i} autoplay="autoplay" controls loop muted/>
                                                                                                    )
                                                                                                })

                                                                                            ) : (null) 
                                                                                            }
                                                                                        </Flex>


                                                                                        <Textarea
                                                                                            fontSize={'sm'}
                                                                                            minH={'35vh'}
                                                                                            value={item?.description?.split('<---Images--->')[0].trim()}
                                                                                            onChange={(e) => { }}
                                                                                            fontFamily={'monospace'}
                                                                                            fontWeight={600}
                                                                                        />
                                                                                        <Flex w="100%" flexWrap={'wrap'}>
                                                                                            {
                                                                                                item.tags && item.tags.length > 0 ? (
                                                                                                    item.tags?.map((tag, i) => (
                                                                                                        <HStack py={1}>
                                                                                                            <Tag
                                                                                                                size={'sm'}
                                                                                                                key={i} color={'white'} bg={tag.tag_fg}>
                                                                                                                {tag.name}
                                                                                                            </Tag>
                                                                                                        </HStack>
                                                                                                    )
                                                                                                    )
                                                                                                ) : null
                                                                                            }
                                                                                        </Flex>


                                                                                    </AccordionPanel>
                                                                                </AccordionItem>
                                                                            )
                                                                        })
                                                                    ) : (
                                                                    <Flex w="100%" h="500px" alignItems={'center'} justifyContent={'center'}><Spinner color='purple.500' /></Flex>)
                                                                }
                                                            </Accordion>
                                                        </DrawerBody>

                                                        <DrawerFooter>
                                                            <Button variant='outline' mr={3} onClick={onClose}>
                                                                Cancel
                                                            </Button>
                                                            <Button colorScheme='blue'>Save</Button>
                                                        </DrawerFooter>
                                                    </DrawerContent>
                                                </Drawer>
                                            </Box>

                                            <Flex
                                                alignItems={'center'} justifyContent={'flex-start'} w="100%" h="5%">
                                                <Avatar
                                                    size={'sm'}
                                                    marginTop={'8'}
                                                    name='Christian Nwamba' src='https://bit.ly/code-beast' />
                                            </Flex>
                                        </VStack>
                                    </AccordionPanel>

                                    {/*  */}
                                </AccordionItem>
                            ))}


                        </Accordion>
                    ) : (
                        <Accordion
                            allowToggle
                            overflow={'scroll'} h="480px" w="100%">
                            {Spaces?.map((item, i) => (
                                <AccordionItem
                                    onClick={() => { setCurrentSpace(item.id) }}
                                    borderTop={'none'}
                                    borderColor={'gray.100'}
                                    key={i} w="100%">
                                    <h2>
                                        <AccordionButton>
                                            <Box flex='1' textAlign='left'>
                                                <Text
                                                    fontSize={'25px'}
                                                    fontWeight={700} fontFamily={'monospace'}>
                                                    {item.name}
                                                </Text>
                                            </Box>
                                            <AccordionIcon />
                                        </AccordionButton>
                                    </h2>
                                    <AccordionPanel
                                        h={'max-content'}
                                        bg={'purple.50'}
                                        bgImage={"url('/twirl.png')"}
                                        bgPosition="right"
                                        bgSize={'100%'}
                                        bgRepeat="no-repeat"
                                        pb={4}>
                                        <VStack w="100%" h="100%">
                                            <Box w="100%" h="95%" bg="white">
                                                {
                                                    Folders && Folders.length > 0 ? (
                                                        Folders?.map((item, i) => (
                                                            <Box key={i}>

                                                                <VStack py={3} alignItems={'flex-start'} px={3}>

                                                                    <Link
                                                                        color={'purple.400'}
                                                                        fontFamily={'monospace'}
                                                                        fontWeight={700} fontSize={'lg'}>
                                                                        <Icon as={AiTwotoneFolderOpen} w={3} h={3} /> {item.name}
                                                                    </Link>
                                                                    <Text
                                                                        color={'purple.400'}
                                                                        fontFamily={'monospace'}
                                                                        fontWeight={700}
                                                                        fontSize={'15px'}
                                                                    >
                                                                        <Icon as={MdFilterList} w={3} h={3} /> Lists:
                                                                    </Text>

                                                                    {
                                                                        item.lists && item.lists.length > 0 ? (
                                                                            item.lists?.map((item2, i) => (
                                                                                <HStack w="100%" key={i}>

                                                                                    <Link
                                                                                        color={'purple.400'}
                                                                                        fontFamily={'monospace'}
                                                                                        fontWeight={700}
                                                                                        ref={btnRef}
                                                                                        fontSize={'13px'}
                                                                                        onClick={() => { setCurrentList(item2.id); setCurrentFolder(item.id); GetMyTasks(item2.id), onOpen() }}
                                                                                        px={5}
                                                                                    >
                                                                                        {item2.name}
                                                                                    </Link>

                                                                                    <RadioGroup onChange={() => setglobalList(item2.id)} value={globalList}>
                                                                                        <Stack direction='row'>
                                                                                            <Radio value={item2.id}></Radio>
                                                                                        </Stack>
                                                                                    </RadioGroup>
                                                                                </HStack>
                                                                            ))
                                                                        ) : (<Box>
                                                                            No lists
                                                                        </Box>)


                                                                    }

                                                                </VStack>

                                                            </Box>
                                                        ))
                                                    ) : (<Box>
                                                        No folders</Box>)
                                                }
                                                {/*  <Drawer
                                                    isOpen={isOpen}
                                                    placement='bottom'
                                                    onClose={onClose}
                                                    finalFocusRef={btnRef}
                                                >
                                                    <DrawerOverlay />
                                                    <DrawerContent h="700px">


                                                        <DrawerBody>
                                                            <Accordion allowToggle h={'max-content'} overflow={'scroll'}>
                                                                {
                                                                    Tasks && Tasks.length > 0 ? (
                                                                        Tasks?.map((item, i) => {

                                                                            var imageContainer = item?.description?.split('<---Images--->')[1]
                                                                            var images = imageContainer?.match(/<img[^>]*>/g)
                                                                            var profilePhoto = images?.find(item => item.includes('avatar'))?.replace(/&amp;/g, '&').split('"')[1]?.split('"')[0]

                                                                            var posts = images?.filter((z, j) => {

                                                                                if (z.includes('feed-shared-actor__avatar-image')) return null;
                                                                                if (z.includes('profile photo')) return null

                                                                                else return z


                                                                            })

                                                                            return (


                                                                                <AccordionItem borderTop={'0px'} py={3} key={i}>
                                                                                    <h2>
                                                                                        <AccordionButton>
                                                                                            <HStack flex='1' textAlign='left'>

                                                                                                <Tag
                                                                                                    w="11%"
                                                                                                    h="90%"
                                                                                                    borderRadius={'300px'}
                                                                                                    bg={gradients[Math.floor(Math.random() * gradients.length)].backgroundColor}
                                                                                                    bgImage={gradients[Math.floor(Math.random() * gradients.length)].backgroundImage}
                                                                                                    border={'5px solid white'}

                                                                                                >{""}</Tag>
                                                                                                <Avatar
                                                                                                    size={'sm'}
                                                                                                    key={i}
                                                                                                    src={profilePhoto} alt="ok" />

                                                                                                <Text fontWeight={800} fontFamily={'monospace'}>
                                                                                                    {item.name}
                                                                                                </Text>



                                                                                            </HStack>
                                                                                            <AccordionIcon />
                                                                                        </AccordionButton>
                                                                                    </h2>
                                                                                    <AccordionPanel h={'max-content'} pb={4}>
                                                                                        <Flex
                                                                                            bg="gray.50"
                                                                                            flexDirection={'column'}
                                                                                            paddingBottom={3} w="100%" alignItems={'center'} justifyContent={'center'}>
                                                                                            {
                                                                                                posts && posts.length > 0 ? (
                                                                                                    posts?.map((im, i) => {

                                                                                                        return (
                                                                                                            <Image w="70%" src={im?.replace(/&amp;/g, '&').split('src="')[1]?.split('"')[0]} key={i} alt="ko" />
                                                                                                        )
                                                                                                    })

                                                                                                ) : (<Box>No post images</Box>)
                                                                                            }
                                                                                        </Flex>


                                                                                        <Textarea
                                                                                            fontSize={'sm'}
                                                                                            minH={'35vh'}
                                                                                            value={item?.description?.split('<---Images--->')[0].trim()}
                                                                                            onChange={(e) => { }}
                                                                                            fontFamily={'monospace'}
                                                                                            fontWeight={600}
                                                                                        />
                                                                                        <Flex w="100%" flexWrap={'wrap'}>
                                                                                            {
                                                                                                item.tags && item.tags.length > 0 ? (
                                                                                                    item.tags?.map((tag, i) => (
                                                                                                        <HStack py={1}>
                                                                                                            <Tag
                                                                                                                size={'sm'}
                                                                                                                key={i} color={'white'} bg={tag.tag_fg}>
                                                                                                                {tag.name}
                                                                                                            </Tag>
                                                                                                        </HStack>
                                                                                                    )
                                                                                                    )
                                                                                                ) : null
                                                                                            }
                                                                                        </Flex>


                                                                                    </AccordionPanel>
                                                                                </AccordionItem>
                                                                            )
                                                                        })
                                                                    ) : (<Box>
                                                                        No tasks</Box>)
                                                                }
                                                            </Accordion>
                                                        </DrawerBody>

                                                        <DrawerFooter>
                                                            <Button variant='outline' mr={3} onClick={onClose}>
                                                                Cancel
                                                            </Button>
                                                            <Button colorScheme='blue'>Save</Button>
                                                        </DrawerFooter>
                                                    </DrawerContent>
                                                </Drawer> */}
                                            </Box>

                                            <Flex
                                                alignItems={'center'} justifyContent={'flex-start'} w="100%" h="5%">
                                                <Avatar
                                                    size={'sm'}
                                                    marginTop={'8'}
                                                    name='Christian Nwamba' src='https://bit.ly/code-beast' />
                                            </Flex>
                                        </VStack>
                                    </AccordionPanel>

                                    {/*  */}
                                </AccordionItem>
                            ))}


                        </Accordion>
                    )
                }

                <Modal isOpen={GloabalIsOpen} onClose={GlobalOnClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Modal Title</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            {
                                Lists
                            }
                        </ModalBody>

                        <ModalFooter>
                            <Button colorScheme='blue' mr={3} onClick={onClose}>
                                Close
                            </Button>
                            <Button variant='ghost'>Secondary Action</Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>



            </VStack>
         


        </VStack>
    )
}



const root = ReactDOM.createRoot(document.getElementById("react-target"));

root.render(
    <ChakraProvider>
        <Popup />
    </ChakraProvider>
)
