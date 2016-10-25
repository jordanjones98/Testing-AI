'use strict'

exports.handle = function handle(client) {

const willingToMeetMessage = client.createStep({
    satisfied() {
        return false
    },

    prompt() {
        client.addTextResponse('Thats great, who are you looking to meet?')
        client.done()
    }
})

const notWillingToMeetMessage = client.createStep({
    satisfied() {
        return false
    },

    prompt() {
        client.addTextResponse('Hmm, we wish you were. I think we could help you meet someone.')
        client.done()
    }
})

const noShowStuffCES = client.createStep({
    satisfied() {
        return false
    },

    prompt() {
        client.addTextResponse('Thats too bad.. If you would like to learn more about it check it out here! https://www.ces.tech/')
        client.done()
    }
})

const showStuffCES = client.createStep({
    satisfied() {
        return false
    },

    next() {
      const meeting = client.getConversationState().isMeeting
      if (meeting === true) {
          return 'WillingToMeet'
      } else if (meeting === false) {
          return 'notWillingToMeet'
      }
    },

    prompt() {
        client.addTextResponse("Cool I am too! Are you looking to set up any meetings there?")
        let settingUpMeeting = client.getMessagePart().classification.base_type.value
        if (settingUpMeeting === 'affirmative') {
          client.updateConversationState({
            isMeeting: true,
          })
          return 'init.proceed' // `next` from this step will get called
        } else if (settingUpMeeting === 'decline') {
          client.updateConversationState({
            isMeeting: false,
          })
          return 'init.proceed' // `next` from this step will get called
        }
    }
})

const checkIfGoingToCES = client.createStep({
  satisfied() {
    return (typeof client.getConversationState().isGoingToCES !== 'undefined')
  },

  next() {
    const isGoing = client.getConversationState().isGoingToCES
    if (isGoing === true) {
        return 'showCES'
    } else if (isGoing === false) {
        return 'noShowCES'
    }
},

  prompt() {
    let baseClassification = client.getMessagePart().classification.base_type.value
    if (baseClassification === 'affirmative') {
      client.updateConversationState({
        isGoingToCES: true,
      })
      return 'init.proceed' // `next` from this step will get called
    } else if (baseClassification === 'decline') {
      client.updateConversationState({
        isGoingToCES: false,
      })
      return 'init.proceed' // `next` from this step will get called
    }

    client.addTextResponse('Hey! are you going to CES?')

    // If the next message is a 'decline', like 'don't know'
    // or an 'affirmative', like 'yeah', or 'that's right'
    // then the current stream will be returned to
    client.expect(client.getStreamName(), ['affirmative', 'decline'])
    client.done()
  }
})

client.runFlow({
  streams: {
    main: 'showContent',
    showContent: [checkIfGoingToCES],
    showCES: [showStuffCES],
    noShowCES: [noShowStuffCES],
    willingToMeet: [willingToMeetMessage],
    notWillingToMeet: [notWillingToMeetMessage],

  }
})

}
