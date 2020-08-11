// Что сделать:
// 1. Улучшить работу findEvent() функции: чтобы проверяла по всем параметрам и искала похожие результаты.
// 
// 

const fs = require(`fs`);
const readline = require('readline');

class Event {
    constructor(sport, place, date, time) {
        this.sport = sport;
        this.place = place;
        this.date = date;
        this.time = time;
    }

}

class EventList {
    constructor() {
        this.dialog = {
            typeCommand: `\nPlease type the command, if you don't know the commands, type "help". Command: `,
            help: `\nAvailable commands are: "show", "add", "remove".`,
            emptyList: `\nThe events list is empty.`,
            prepareToAdd: `\nYou will now add a new event, follow further instructions.`,
            itemAdded: `\nEvent has been added to the events list.`,
            eventAlreadyExists: foundEvent => 
                console.log(`\nEvent already exists, it's information:\n\nSport: ${foundEvent.sport}\nPlace: ${foundEvent.place}\nDate: ${foundEvent.date}\nTime: ${foundEvent.time}`), 
            prepareToRemove: `\nYou will now remove an event, follow further instructions.`,
            itemToRemove: `\nNow type what you'd like to remove: `,
            itemRemoved: `\nEvent has been removed from the events list.`,
            itemMissed: `\nEvent has not been found. List of existing events: \n`,
            existingEvents: listOfEvents => {
                listOfEvents.map(e => console.log(e))
            },
            incorrect: `\nIncorrect command, type "help" to find out existing commands.`,
            enterEventType: `\nPlease enter a sport type of the event (e.g. "Football"): `,
            enterEventPlace: `Please enter where the event takes place: `,
            enterEventDate: `Enter the event date (dd.mm.yyyy format): `,
            enterEventTime: `Enter the event time (hh:mm format): `
            }

        this.list = this.read();
    }
    
    parseArgvs(command, argument) {
        if (command && argument) {
            this.makeDecision(command.toLowerCase(), argument)
        } else if (!argument) {
            this.makeDecision(command.toLowerCase())
        } else {
            this.makeDecision()
        }
    }

    async makeDecision(command, argument) {
        if (this[command]) {
            await this[command](argument)
            this.updateList()
        } else if (command == undefined) {
            this.typeCommand()
        } else {
            console.log(this.dialog.incorrect);
            this.makeDecision()
        }
    }

    async typeCommand() {
        let answer = await this.askQuestion(this.dialog.typeCommand);
        this.makeDecision(answer);
    }

    async add(sport, place, date, time) { //dobavit validacii
        console.log(this.dialog.prepareToAdd)
        
        sport = (sport == undefined)
            ? await this.askQuestion(this.dialog.enterEventType)
            : sport;

        place = (place == undefined)
            ? await this.askQuestion(this.dialog.enterEventPlace)
            : place;

        date = (date == undefined)
            ? await this.askQuestion(this.dialog.enterEventDate)
            : date;

        time = (time == undefined)
            ? await this.askQuestion(this.dialog.enterEventTime)
            : time;

        if (this.findEvent(sport, place, date, time)) {
            let foundEvent = this.findEvent(sport, place, date, time)
            this.dialog.eventAlreadyExists(foundEvent);
        } else {
            let addedEvent = new Event(sport, place, date, time);
            this.list.push(addedEvent);
            console.log(this.dialog.itemAdded);
        }
    }
        
    async remove(sport, place, date, time) {
        console.log(this.dialog.prepareToRemove)
        
        sport = (sport == undefined)
            ? await this.askQuestion(this.dialog.enterEventType)
            : sport;

        place = (place == undefined)
            ? await this.askQuestion(this.dialog.enterEventPlace)
            : place;

        date = (date == undefined)
            ? await this.askQuestion(this.dialog.enterEventDate)
            : date;

        time = (time == undefined)
            ? await this.askQuestion(this.dialog.enterEventTime)
            : time;
        
        if (this.findEvent(sport, place, date, time)) {
            this.list = this.list.filter(e => e.sport !== sport || e.place !== place || e. date !== date || e.time !== time)
            console.log(this.dialog.itemRemoved)
        } else {
            console.log(this.dialog.itemMissed)
            this.dialog.existingEvents(this.list);
        }
    }

    askQuestion(question) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: false
        })
    
        return new Promise((resolve, reject) => {
            rl.question(question, answer => {
                rl.close();
                resolve(answer);
            })
        })
    }
    
    help() {
        console.log(this.dialog.help);
        this.makeDecision()
    }

    show() {
        if (this.list == ``) {
            console.log(this.dialog.emptyList);
        } else {
            console.log(`\n${this.list.join(`\n`)}`);
        }
    }
    
    read() {
        let rawList = fs.readFileSync(`events-list.txt`, `utf8`);

        if (!rawList) {
            return []
        } else {
            let jsonData = JSON.parse(rawList);
            return jsonData;
        }
    }

    updateList() {
        let jsonList = JSON.stringify(this.list, null, ` `);
        fs.writeFileSync(`events-list.txt`, jsonList);
    }

    findEvent(sportToFind, placeToFind, dateToFind, timeToFind) {
        let foundEvent = this.list.find(e => e.sport == sportToFind && e.place == placeToFind && e.date == dateToFind && e.time == timeToFind);

        if (foundEvent) {
           return foundEvent;
        } else return;
    }  
}

let sportsEventList = new EventList();
let [command, argument] = [process.argv[2], process.argv[3]];
sportsEventList.parseArgvs(command, argument)