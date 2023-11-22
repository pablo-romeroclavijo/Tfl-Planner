import React, { useEffect, useState } from "react"
import {
	View,
	Text,
	StyleSheet,
	Modal,
	Svg,
	SafeAreaView,
	ScrollView,
	Pressable,
	Alert,
} from "react-native"
import {
	CreateEventForm,
	CreateEventModal,
	AppButton,
	Header,
	ViewEventsCarousel,
	JoinEventForm,
	GetAsync,
	CreateAsync,
} from "../../Components"
import moment from "moment"

export default function Home({ navigation }) {
	const [createEvent, setCreateEvent] = useState(false)
	const [joinEvent, setJoinEvent] = useState(false)
	const [viewEvent, setViewEvent] = useState(false)
	const [events, setEvents] = useState([]);

	useEffect(() => {
		setPreferenceTokens()
		getEvents().then((events) => setEvents(events));
	}, [])

	async function clickCreateEvent() {
		setCreateEvent(!createEvent)
	}

	const clickJoinEvent = () => {
		setViewEvent(!joinEvent)
	}

	

	return (
		// <ImageBackground source={image} style={{ width: "100%", height: "100%" }}>

		<ScrollView style={styles.container}>
			<Header />
			<View style={{ alignSelf: "center" }}></View>
			<Text style={styles.title}>My Home</Text>
			<View style={styles.newEventContainer}>
				<AppButton onPress={clickCreateEvent} title="Create Event" />
				{createEvent ? (
					<CreateEventModal
						closeModal={clickCreateEvent}
						createEvent={createEvent}
					/>
				) : null}
			</View>
			<ViewEventsCarousel  title = {'My events'} events={events} />

			<ViewEventsCarousel  title = {'My invites'} events={events} />
			{/* <View>
				<AppButton title="Join Event" onPress={clickJoinEvent} />
				<Modal
					visible={joinEvent}
					onRequestClose={() => clickJoinEvent()}
				></Modal>
			</View> */}
			<JoinEventForm closeModal={clickJoinEvent} />
		</ScrollView>
		// </ImageBackground>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	title: {
		textAlign: "center",
		fontSize: 26,
	},
	newEventContainer: {
		width: 350,
		margin: 40,
	},
	subHeading: {
		textAlign: "center",
	},

})

async function setPreferenceTokens() {
	const options = {
		method: "GET",
		headers: {
			"Accept": "application/json",
			"Content-Type": "application/json",
			"Authorization": await GetAsync("token"),
		},
	}
	const response = await fetch(
		"https://metro-mingle.onrender.com/user/profile",
		options
	)
	if (response.status == 200) {
		const data = await response.json()
		console.log(await GetAsync("token"))
		console.log(data)
		console.log(data.preferences.accessibilityPreferences)
		if (data.postcode == null) {
			console.log(postcode, "passed")
			await CreateAsync("postcode", "")
		} else {
			await CreateAsync("postcode", data.postcode)
		}
		if (data.preferences.accessibilityPreferences == null) {
			await CreateAsync("accessibilityPreferences", "")
		} else {
			await CreateAsync(
				"accessibilityPreferences",
				data.preferences.accessibilityPreferences
			)
		}
		if (data.preferences.journeyPreferences == null) {
			await CreateAsync("journeyPreferences", "")
		} else {
			await CreateAsync(
				"journeyPreferences",
				data.preferences.journeyPreferences
			)
		}
		if (data.preferences.maxWalkingMinutes == null) {
			await CreateAsync("maxWalkingMinutes", "")
		} else {
			await CreateAsync(
				"maxWalkingMinutes",
				String(data.preferences.maxWalkingMinutes)
			)
		}
		if (data.preferences.walkingSpeed == null) {
			await CreateAsync("walkingSpeed", "")
		} else {
			await CreateAsync("walkingSpeed", data.preferences.walkingSpeed)
		}
		console.log("Postcode", await GetAsync("postcode"))
		console.log("Access", await GetAsync("accessibilityPreferences"))
		console.log("Journey", await GetAsync("journeyPreferences"))
		console.log("Walk Mins", await GetAsync("maxWalkingMinutes"))
		console.log("Walk Speed", await GetAsync("walkingSpeed"))
	}
}
async function getEvents() {
	const token = await GetAsync("token")
	try {
		const options = {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"Authorization": token,
			},
		}
		const response = await fetch(
			"https://metro-mingle.onrender.com/event/all",
			options
		)

		const data = await response.json()

		if (response.status == 200) {
			return filterEventsHappeningToday(data.events)
		} else {
			console.log("error")
		}
	} catch (error) {
		console.log(error)
	}
}

	//filter for today event
  const filterEventsHappeningToday = (events) => {
    const today = moment().format('YYYY-MM-DD');
    return events.filter(event => moment(event.date).isSame(today, 'day'));
  };