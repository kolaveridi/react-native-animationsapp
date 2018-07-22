import React  from 'react';
import {
    View,
    Animated,
    PanResponder 
    ,Dimensions
 } from 'react-native';
 const SCREEN_WIDTH = Dimensions.get('window').width;
export default  class Deck extends React.Component {
    constructor(props){
        super(props);
        const position=new Animated.ValueXY()
        //decalred as  local variable 
        this.PanResponder=PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove:(event,gesture)=>{
                console.log(gesture);
                position.setValue({x:gesture.dx,y:gesture.dy})
                console.log('abc');
            },
            onPanResponderRelease:()=>{
                this.resetPosition();
            }
        });
        
        this.state={position};
    }
    resetPosition=()=>{
        Animated.spring(this.state.position,{
            toValue:{x:0,y:0}
        }).start()
    }
    getCardStyle =() =>{
        
        const rotate=this.state.position.x.interpolate({
           inputRange:[-SCREEN_WIDTH*1.5,0,SCREEN_WIDTH*1.5],
           outputRange:['-120deg','0deg','120deg']
        });
        return {
            ...this.state.position.getLayout(),
            transform:[{rotate:rotate}]
        };
}
//style={this.state.position.getLayout()}
    renderCards=()=>{
        return this.props.data.map((item,index) => {
            if(index ===0){
                console.log('index',index);
                // so that we can only drag the first card 
                return(
               <Animated.View
                 key={item.id}
                 
                  {...this.PanResponder.panHandlers}
                  style={this.getCardStyle()}
                > 
                {this.props.renderCards(item)}
                </Animated.View>
                );
                
            }
            return this.props.renderCards(item);
        });
    }
    render(){
        return(
         <View>
             {this.renderCards()}
         </View>
        );
    }
}