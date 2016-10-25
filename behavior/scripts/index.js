'use strict'

exports.handle = function handle(client) {
  const sayHello = client.createStep({
        satisfied() {
          return false
        },

      prompt() {
          client.addTextResponse('Hello world, I mean human')
          client.done()
      }
  })

  const goingToCES = client.createStep({
      client.addTextResponse('Great! You\'re going to CES!')
  })

  const notGoingToCES = client.createStep({
      client.addTextResponse('Hmm... You\'re not going.. Check out out here!')
  })

  const checkIfAfirmative = client.createStep({
    satisfied() {
      return (typeof client.getConversationState().isAfirmative !== 'undefined')
    },

    next() {
      const isOverEighteen = client.getConversationState().isAfirmative
      if (isAfirmative === true) {
          return 'afirmativeGoing'
      } else if (isAfirmative === false) {
          return 'afirmativeNotGoing'
      }
    }
    prompt() {
  let baseClassification = client.getMessagePart().classification.base_type.value
  if (baseClassification === 'affirmative') {
    client.updateConversationState({
      checkIfAfirmative: true,
    })
    return 'init.proceed' // `next` from this step will get called
  } else if (baseClassification === 'decline') {
    client.updateConversationState({
      checkIfAfirmative: false,
    })
    return 'init.proceed' // `next` from this step will get called
  }

  client.addResponse('app:response:name:ask_over_eighteen')

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
    showContent: [checkIfAfirmative],
    afirmativeGoing: [goingToCES],
    afirmativeNotGoing: [notGoingToCES],
  }
})
}
