<script setup lang="ts">
import { Client, Account, ID, Databases, Locale, Query, type Models } from 'appwrite'
import { socket } from "../components/socket"
import MembersList from '~/components/MembersList.vue';

let chatMessages = ref(undefined)
let conferenceInformation = ref(undefined)
let chat = ref(false)
let cookie;
let activeVideo = ref(true);
let activeAudio = ref(true);
let accountInformation = ref(undefined);
let localStream;
let localStream1;
let yourUserId;
let pc1;
let outputMessage = ref('');
let mainList = [];
let userNameList = [];
let usersList = ref([])
let adminStatus = ref(false)
let secret = ref(undefined)
let desktopStream = false
let desktopRecord = false
const parts = []
let mediaRecorder = []
const toast = useToast()

const getLastItem = (thePath) => thePath.substring(thePath.lastIndexOf('-') + 1);

const offerOptions = {
	offerToReceiveAudio: 1,
	offerToReceiveVideo: 1
};

const iceConfiguration = {
	iceServers: [
		{
			urls: 'stun:stun.l.google.com:19302'
		},
		{
			urls: 'turn:217.28.222.133:3478',
			username: 'dimchik',
			credential: '4PkBWwRwkq4YZi'
		}
	]
};

function getCookie() {
	return document.cookie.split("; ").reduce((acc, item) => {
		const [name, value] = item.split("=");
		acc[name] = value;
		return acc;
	}, {});
}

onMounted(() => {
	console.log("Куки:");
	console.log(document.cookie);
	cookie = getCookie();
	console.log("Обработанные куки:");
	console.log(cookie);

	const account = new Account(client);

	if (cookie.sessionId != "") {
		const promise0 = account.getSession(cookie.sessionId);

		promise0.then(
			function (response) {
				console.log("Сессия найдена:");
				console.log(response); // Success

				const promise00 = account.get();

				promise00.then(
					function (response) {
						console.log("Информация по аккаунту:");
						console.log(response); // Success
						accountInformation.value = response
						const promise01 = databases.listDocuments(
							"666459840018cf31333a",
							"6664599a003c2329af67",
							[Query.equal("$id", getLastItem(window.location.href))]
						);
						promise01.then(function (response) {
							console.log(response)
							conferenceInformation.value = response.documents[0]
							console.log("Информация по конференции:")
							console.log(conferenceInformation.value)

							const promise = databases.listDocuments(
								"666459840018cf31333a",
								"666595dd002b049dc275",
								[Query.equal("Conference", getLastItem(window.location.href)),
								Query.orderAsc("MessageTime")]
							);
							promise.then(function (response) {
								chatMessages.value = response.documents
								console.log("Список сообщений в чате:")
								console.log(chatMessages.value)
								start()
							})
						}, function (error) {
							("Ошибка подгрузки информации по конференции");
							console.log(error); // Failure
						})
					},
					function (error) {
						("Ошибка подгрузки информации по аккаунту");
						console.log(error); // Failure
					}
				);
			},
			function (error) {
				console.log("Сессия НЕ найдена:");
				console.log(error); // Failure
				document.cookie = `userId=;expires=-1`;
				document.cookie = "sessionId=;expires =-1";
				navigateTo({
					path: '/Authorization'
				});
			}
		);
	} else {
		navigateTo({
			path: '/Authorization'
		});
	}
})


const client = new Client();

client
	.setEndpoint('https://cloud.appwrite.io/v1')
	.setProject('6655c51b002ccc6d11bf');

const databases = new Databases(client);

function toogleChat() {
	chat.value = !chat.value
}

function getChatMessages(conference) {
	const promise = databases.listDocuments(
		"666459840018cf31333a",
		"666595dd002b049dc275",
		[Query.equal("Conference", conference),
		Query.orderAsc("MessageTime")]
	);
	promise.then(function (response) {
		chatMessages.value = response.documents
		console.log("Список сообщений в чате:")
		console.log(chatMessages.value)
	})
}

async function addVideoCamDiv(id) {
	var checkExist = setInterval(function () {
		if (document.getElementById(id) !== undefined) {
			console.log("Exists!");
			clearInterval(checkExist)
			var vid = document.getElementById(id);
			vid.muted = true;
			vid.srcObject = localStream;
			vid.addEventListener('loadedmetadata', () => {
				vid.play();
			})
			document.getElementById(id + 'FullScreen').onclick = function () {
				vid.requestFullscreen()
			}
		}
	}, 1000)
}

async function start() {
	try {
		const stream = await navigator.mediaDevices
			.getUserMedia({
				video: true,
				audio: true
			})
			.then((stream) => {
				localStream = stream;
				yourUserId = accountInformation.value.$id
				var obj = {
					name: accountInformation.value.name,
					userFrom: accountInformation.value.$id,
					activeVideo: true,
					activeAudio: true
				};
				usersList.value.push(obj)
				console.log(accountInformation.value.$id)
				console.log(document.getElementById(accountInformation.value.$id))
				addVideoCamDiv(accountInformation.value.$id)
			});
	} catch (error) {
		console.log(error);
		toast.add({ title: 'Вы не разрешили доступ к видео и микрофону. Переводим вас на главную страницу' })
	}
	joinRoom();
}

function joinRoom() {
	// JoinRoomRequestPacket(String roomId, String userId, String name, boolean useVideo, boolean useAudio)
	socket.emit(
		'joinRoom',
		{
			roomId: getLastItem(window.location.href),
			userId: accountInformation.value.$id,
			name: accountInformation.value.name,
			useVideo: true,
			useAudio: true
		},
		(response) => {
			var data = JSON.parse(response);

			console.log('joinRoom Response: ' + response);
			if (data.exists === false) {
				toast.add({ title: 'Такой комнаты не существует' })
			} else {
				if (conferenceInformation.value.Author == accountInformation.value.$id) {
					adminStatus.value = true;
				}
				secret.value = data.adminSecret;
				socket.emit('startCall', {
					roomId: getLastItem(window.location.href),
					userId: accountInformation.value.$id,
					name: accountInformation.value.name
				});
			}
		}
	);
}

socket.on('startCall', async (arg) => {
	console.log('startCall arg: ' + arg);
	pc1 = new RTCPeerConnection(iceConfiguration);
	var obj = {
		name: arg.name,
		userFrom: arg.userId,
		pc: pc1,
		activeVideo: true,
		activeVide0: true
	};
	mainList[arg.userId] = obj;
	userNameList.push(arg.userId);
	usersList.value.push(obj)
	addVideoCamDiv(arg.userId)

	localStream.getTracks().forEach((track) => obj.pc.addTrack(track, localStream));

	obj.pc.addEventListener('track', e => {
		let vid = document.getElementById(arg.userId);
		vid.srcObject = e.streams[0];
		console.log('5');
		vid.addEventListener('loadedmetadata', () => {
			vid.play();
		});
	});

	const offer = await obj.pc.createOffer(offerOptions);
	await onCreateOfferSuccess(offer, arg.userId, obj.pc);
	obj.pc.addEventListener('connectionstatechange', (ev) => {
		disconnectDetect(arg.userId);
	});
	obj.pc.addEventListener('icecandidate', (e) => onIceCandidate(e));
	console.log('1');
});

async function onCreateOfferSuccess(desc, user, pc) {
	await pc.setLocalDescription(desc);
	socket.emit('createOffer', {
		roomId: getLastItem(window.location.href),
		offerFromId: accountInformation.value.$id,
		name: accountInformation.value.name,
		offerToId: user,
		offerBody: desc
	});
}

socket.on('createOffer', async (arg) => {
	console.log(arg);
	pc1 = new RTCPeerConnection(iceConfiguration);
	var obj = {
		name: arg.name,
		userFrom: arg.offerFromId,
		pc: pc1,
		activeVideo: true,
		activeAudio: true
	};
	mainList[arg.offerFromId] = obj;
	userNameList.push(arg.offerFromId);
	usersList.value.push(obj)
	addVideoCamDiv(arg.userId)

	localStream.getTracks().forEach((track) => obj.pc.addTrack(track, localStream));

	obj.pc.addEventListener('track', e => {
		let vid = document.getElementById(arg.offerFromId);
		vid.srcObject = e.streams[0];
		console.log('5');
		vid.addEventListener('loadedmetadata', () => {
			vid.play();
		});
	});

	await obj.pc.setRemoteDescription(arg.offerBody);
	const answer = await obj.pc.createAnswer();
	await onCreateAnswerSuccess(answer, arg.offerFromId, obj.pc);
	obj.pc.addEventListener('connectionstatechange', (ev) => {
		disconnectDetect(arg.offerFromId);
	});
	obj.pc.addEventListener('icecandidate', (e) => onIceCandidate(e));
	console.log('2');
});

async function onCreateAnswerSuccess(desc, user, pc) {
	await pc.setLocalDescription(desc);
	socket.emit('answerOffer', {
		roomId: getLastItem(window.location.href),
		answerFromId: accountInformation.value.$id,
		answerToId: user,
		answerBody: desc
	});
}

socket.on('answerOffer', async (arg) => {
	console.log(arg);
	await mainList[arg.answerFromId].pc.setRemoteDescription(arg.answerBody);
	console.log('3');
});

async function onIceCandidate(event) {
	socket.emit('iceCandidate', {
		roomId: getLastItem(window.location.href),
		iceFromId: accountInformation.value.$id,
		iceCandidateBody: event.candidate
	});
}

socket.on('iceCandidate', async (arg) => {
	await mainList[arg.iceFromId].pc.addIceCandidate(arg.iceCandidateBody);
	console.log('4');
});

function disconnectDetect(user, ev) {
	if (
		mainList[user].pc.connectionState === 'disconnected' ||
		mainList[user].pc.connectionState === 'failed' ||
		mainList[user].pc.connectionState === 'closed'
	) {
		console.log('Выполняется');
		usersList.value = usersList.value.filter((userId) => userId.userFrom !== user)
	}
	console.log(mainList[user].pc.iceConnectionState);
	console.log('Не выполняется');
}

socket.on('connect_error', (err) => {
	console.log(`connect_error due to ${err.message}`);
});

socket.on('kickUser', (arg) => {
	console.log('Вас исключили');
	toast.push('Администратор конференции исключил вас', {
		onpop: () => {
			location.href = 'http://themeeter.ru';
		}
	});
});

function deleteUser() {
	socket.emit(
		'deleteUser',
		{
			roomId: getLastItem(window.location.href),
			userId: accountInformation.value.$id
		},
		(response) => {
			var data = JSON.parse(response);
		})
}

function toggleVideo() {
	activeVideo.value = !activeVideo.value
	socket.emit(
		'toggleVideo',
		{
			roomId: getLastItem(window.location.href),
			userId: accountInformation.value.$id,
			activeVideo: activeVideo.value
		},
		(response) => {
			var data = JSON.parse(response);
		}
	)
	localStream.getTracks().forEach((track) => {
		// audio or video
		if (track.kind === 'video') {
			track.enabled = !track.enabled;
		}
	});
	if (activeVideo.value == true) {
		var usersListIndex = usersList.value.findIndex((userId) => userId.userFrom == accountInformation.value.$id)
		console.log("Before update: ", usersList.value[usersListIndex])
		usersList.value[usersListIndex].activeVideo = true
		document.getElementById('Button1').style.cssText = "border: solid red 0px"
	} else {
		var usersListIndex = usersList.value.findIndex((userId) => userId.userFrom == accountInformation.value.$id)
		console.log("Before update: ", usersList.value[usersListIndex])
		usersList.value[usersListIndex].activeVideo = false
		document.getElementById('Button1').style.cssText = "border: solid red 3px"
	}
}


function toggleAudio() {
	activeAudio.value = !activeAudio.value
	socket.emit(
		'toggleAudio',
		{
			roomId: getLastItem(window.location.href),
			userId: accountInformation.value.$id,
			activeAudio: activeAudio.value
		},
		(response) => {
			var data = JSON.parse(response);
		}
	)
	localStream.getTracks().forEach((track) => {
		// audio or video
		if (track.kind === 'audio') {
			track.enabled = !track.enabled;
		}
	});
	if (activeAudio.value == true) {
		var obj = document.getElementById(accountInformation.value.$id)
		obj.style.cssText = "box-shadow: 0px 0px 0px 0px rgba(252,0,0,1);"
		document.getElementById('Button2').style.cssText = "border: solid red 0px"
	} else {
		var obj = document.getElementById(accountInformation.value.$id)
		obj.style.cssText = "box-shadow: 0px 0px 0px 3px rgba(252,0,0,1);"
		document.getElementById('Button2').style.cssText = "border: solid red 3px"
	}
}

socket.on('toggleVideo', (arg) => {
	console.log('Video listener')
	if (arg.activeVideo == true) {
		var usersListIndex = usersList.value.findIndex((userId) => userId.userFrom == arg.userId)
		console.log("Before update: ", usersList.value[usersListIndex])
		usersList.value[usersListIndex].activeVideo = true
	} else {
		var usersListIndex = usersList.value.findIndex((userId) => userId.userFrom == arg.userId)
		console.log("Before update: ", usersList.value[usersListIndex])
		usersList.value[usersListIndex].activeVideo = false
	}
})

socket.on('toggleAudio', (arg) => {
	console.log('Audio listener')
	if (arg.activeVideo == true) {
		var usersListIndex = usersList.value.findIndex((userId) => userId.userFrom == arg.userId)
		console.log("Before update: ", usersList.value[usersListIndex])
		var obj = document.getElementById(usersList.value[usersListIndex].userFrom)
		obj.style.cssText = "box-shadow: 0px 0px 0px 0px rgba(252,0,0,1);"
	} else {
		var usersListIndex = usersList.value.findIndex((userId) => userId.userFrom == arg.userId)
		console.log("Before update: ", usersList.value[usersListIndex])
		var obj = document.getElementById(usersList.value[usersListIndex].userFrom)
		obj.style.cssText = "box-shadow: 0px 0px 0px 3px rgba(252,0,0,1);"
	}
})

function back() {
	userNameList.forEach(element => {
		mainList[element].pc.close()
	})
	navigateTo({ path: '/CurrentConferences' });
}

async function getDesktopStream() {
	if (desktopStream == false) {
		desktopStream = true
		try {
			const stream = await navigator.mediaDevices
				.getDisplayMedia({
					video: true,
				})
				.then((stream) => {
					localStream1 = stream;
					var displayTrack = localStream1.getVideoTracks()[0];
					var videoTrack = localStream.getVideoTracks()[0];
					localStream.removeTrack(videoTrack);
					localStream.addTrack(displayTrack);
					userNameList.forEach(element => {
						console.log(element)
						console.log(mainList[element])
						var sender = mainList[element].pc.getSenders().find(function (s) {
							return s.track.kind == videoTrack.kind;
						});
						sender.replaceTrack(displayTrack);
					});
					document.getElementById('Button3').style.cssText = "border: solid red 3px"
				});
		} catch (error) {
			console.log(error)
		}
	} else {
		try {
			desktopStream = false
			const stream = await navigator.mediaDevices
				.getUserMedia({
					video: true,
				})
				.then((stream) => {
					localStream1 = stream;
					var displayTrack = localStream1.getVideoTracks()[0];
					var videoTrack = localStream.getVideoTracks()[0];
					localStream.removeTrack(videoTrack);
					localStream.addTrack(displayTrack);
					userNameList.forEach(element => {
						console.log(element)
						console.log(mainList[element])
						var sender = mainList[element].pc.getSenders().find(function (s) {
							return s.track.kind == videoTrack.kind;
						});
						sender.replaceTrack(displayTrack);
					});
				});
			document.getElementById('Button3').style.cssText = "border: solid red 0px"
		} catch (error) {
			console.log(error)
		}
	}
}

async function getDesktopRecord() {
	if (desktopRecord == false) {
		desktopRecord = true
		try {
			const stream = await navigator.mediaDevices
				.getDisplayMedia({
					video: true,
					audio: true
				})
				.then((stream) => {
					localStream1 = stream;
					mediaRecorder = new MediaRecorder(localStream1, { mimeType: "video/webm" })
					toast.add({ title: 'Вы начали запись конференции' })
					mediaRecorder.start(100)
					mediaRecorder.ondataavailable = function (e) {
						parts.push(e.data)
					}
					document.getElementById('Button4').style.cssText = "border: solid red 3px"
				});
		} catch (error) {
			console.log(error)
		}
	} else {
		try {
			desktopRecord = false
			mediaRecorder.stop()
			const blob = new Blob(parts, {
				type: "video/mp4"
			})
			const url = URL.createObjectURL(blob)
			const a = document.createElement("a")
			const date = new Date()
			var dd = String(date.getDate()).padStart(2, '0');
			var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
			var yyyy = date.getFullYear();
			var hh = date.getHours()
			var m = date.getMinutes()
			var ss = date.getSeconds()
			const link = conferenceInformation.value.Name + '(' + mm + '/' + dd + '/' + yyyy + ' ' + hh + ':' + m + ":" + ss + ')'
			document.body.appendChild(a)
			a.style = "display: none"
			a.href = url
			a.download = link
			toast.add({ title: 'Вы закончили запись конференции ' + url })
			document.getElementById('Button4').style.cssText = "border: solid red 0px"
			a.click()
		} catch (error) {
			console.log(error)
		}
	}
}

// IncomingChatMessagePacket(String roomId, String userId, String message)
socket.on('chatMessage', (arg) => {
	getChatMessages(getLastItem(window.location.href))
});

function sendMessage() {
	if (outputMessage.value !== '') {
		socket.emit(
			'chatMessage',
			{
				roomId: getLastItem(window.location.href),
				fromId: accountInformation.value.$id,
				name: accountInformation.value.name,
				message: outputMessage.value
			},
			(response) => {
				var data = JSON.parse(response);
				console.log(data.status);
				if (data.status === false) {
					toast.add()
					console.log('Сообщение слишком длинное');
				} else {
					var date = new Date()
					var obj = {"Text": outputMessage.value, "Author": accountInformation.value.$id, "MessageTime": date, "SystemMessage": false, "AuthorName": accountInformation.value.name, "Conference": getLastItem(window.location.href)}
					const result = databases.createDocument(
						'666459840018cf31333a', // databaseId
						'666595dd002b049dc275', // collectionId
						ID.unique(), // documentId
						obj // data
					);
					outputMessage.value = '';
					document.getElementById('messageBox').value = '';
				}
			}
		);
	}else{
		console.log('ФРИК?')
	}
}
</script>

<template>
	<div class="fixed flex flex-col h-full w-full">
		<img src="/public/Flag.jpg" alt="Image" class="h-full object-cover">
		<div class='absolute flex auto-cols-max w-full h-screen justify-end bg-black bg-opacity-80'>
			<div
				class="relative flex w-full h-full bg-transparent [transition: width 1s ease-in-out, left 1.5s ease-in-out]">
				<div class="flex flex-wrap gap-4 p-8 w-full h-[90vh] justify-around content-start overflow-hidden">
					<VideoCamDiv v-for="(item, index) in usersList" :item="item" :index="index" :key="item.userFrom"
						:accountInformation="accountInformation"></VideoCamDiv>
				</div>
				<Transition enter-active-class="duration-300 ease-out" enter-from-class="translate-x-full"
					enter-to-class="translate-x-0" leave-active-class="duration-300 ease-in"
					leave-from-class="translate-x-0" leave-to-class="translate-x-full">
					<button
						class="absolute h-[250px] w-[50px] bg-foreground/80 border-border border hover:border-white right-3 self-center rounded-3xl transition"
						@click="toogleChat()"></button>
				</Transition>
			</div>
			<Transition enter-active-class="duration-200 ease-out" enter-from-class="translate-x-full"
				enter-to-class="translate-x-0" leave-active-class="duration-200 ease-in"
				leave-from-class="translate-x-0" leave-to-class="translate-x-full">
				<div v-show="chat" class="w-5/12 h-full bg-transparent z-10">
					<card class="flex flex-col justify-between h-full rounded-l-2xl overflow-hidden">
						<CardHeader v-if="conferenceInformation"
							class="flex flex-row justify-between p-4 gap-4 bg-foreground">
							<div class="flex flex-row">
								<Avatar class="h-12 w-12 bg-background">
									<AvatarImage src="/avatars/01.png" alt="Avatar" />
									<AvatarFallback class="text-foreground">{{ conferenceInformation.Name.substr(0,
										2).toUpperCase() }}
									</AvatarFallback>
								</Avatar>
								<CardTitle class="p-3 text-background">{{ conferenceInformation.Name }}</CardTitle>
							</div>
						</CardHeader>
						<ScrollArea class="flex w-full h-full justify-end">
							<ChatMessage v-if="chatMessages" v-for="(item, index) in chatMessages" :item="item"
								:index="index" :key="item.$id" :accountInformation="accountInformation">
							</ChatMessage>
						</ScrollArea>
						<CardFooter class="flex border-t border-border p-4 gap-4 bg-foreground">
							<textarea v-model="outputMessage" id="messageBox" placeholder="Напишите сообщение..." class="rounded-lg w-full bg-background border border-border px-3 py-2"></textarea>
							<Button @click="sendMessage()" class="w-11 h-11 bg-background rounded-full border border-input"></Button>
						</CardFooter>
					</card>
				</div>
			</Transition>
			<div class="group absolute bottom-0  w-full h-1/6 bg-transparent">
				<div
					class="flex w-[550px] h-[80px] mx-auto mt-28 bg-foreground/80 rounded-2xl transition-all duration-300 group-hover:mt-0 justify-evenly items-center">
					<button @click="toggleVideo()" id="Button1"
						class="flex w-[15%] h-[80%] rounded-3xl hover:border-[3px] justify-center items-center border-outcome-message hover:bg-white transition-all">
						<img src="/public/icons/video-camera-alt.png" class="w-[60%]">
					</button>
					<button @click="toggleAudio()" id="Button2"
						class="flex w-[15%] h-[80%] rounded-3xl hover:border-[3px] justify-center items-center border-outcome-message hover:bg-white transition-all">
						<img src="/public/icons/microphone.png" class="w-[50%]">
					</button>
					<button @click="getDesktopStream()" id="Button3"
						class="flex w-[15%] h-[80%] rounded-3xl hover:border-[3px] justify-center items-center border-outcome-message hover:bg-white transition-all">
						<img src="/public/icons/computer.png" class="w-[50%]">
					</button>
					<button @click="getDesktopRecord()" id="Button4"
						class="flex w-[15%] h-[80%] rounded-3xl hover:border-[3px] justify-center items-center border-outcome-message hover:bg-white transition-all">
						<img src="/public/icons/rec-button.png" class="w-[50%]">
					</button>
					<button @click="back()"
						class="flex w-[15%] h-[80%] rounded-3xl hover:border-[3px] justify-center items-center border-outcome-message bg-red hover:bg-white transition-all">
						<img src="/public/icons/sign-out-alt.png" class="w-[50%]">
					</button>
				</div>
			</div>
		</div>
	</div>
</template>