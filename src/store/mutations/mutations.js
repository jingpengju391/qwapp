import { SET_USER, SET_IMLIST, SET_OBJ, UP_DATA, UP_AUDIO } from '../constants/mutations_type.js';
export { SET_USER, SET_IMLIST, SET_OBJ, UP_DATA, UP_AUDIO }
export default {
	[SET_USER]( state, data ){
		state.user = data;
	},
	[SET_IMLIST]( state, data ){

		const MSYGOBJ = data.flow == 'out' ? data.to : data.from; 

		const OBJ = JSON.parse(JSON.stringify(state.oChat));
		
		OBJ[MSYGOBJ] ? '' : OBJ[MSYGOBJ] = []

		OBJ[MSYGOBJ].push(data);

		state.oChat = OBJ;

	},
	[SET_OBJ]( state, data ){

		if( state.oChat[data] ){
			
			const OBJ = JSON.parse(JSON.stringify(state.oChat));
			
			OBJ[data].forEach(item => item.unread = true)
			
			console.log(OBJ[data])
			
			state.oChat = OBJ;
			
		}else{
			state.oChat[data] = []
		}

	},
	[UP_DATA]( state, data ){

		const MSYGOBJ = data.flow == 'out' ? data.to : data.from; 

		const OBJ = JSON.parse(JSON.stringify(state.oChat));

		if( data.endAudioA ){

			OBJ[MSYGOBJ].forEach( item => item.etyle = false )

		}else{

			OBJ[MSYGOBJ].forEach(item => item.idClient === data.idClient ? item.etyle = !item.etyle : item.etyle = false)

		}

		state.oChat = OBJ;

	},
	[UP_AUDIO]( state, data ){
	
		state.aud = data;
	
	},
}
