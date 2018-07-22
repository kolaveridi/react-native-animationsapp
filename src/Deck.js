import React  from 'react';
import {
    View,
    Animated,
    PanResponder 
    ,Dimensions
 } from 'react-native';
 const SCREEN_WIDTH = Dimensions.get('window').width;
 const SWIPE_THRESHOLD =0.25*SCREEN_WIDTH;
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
            onPanResponderRelease:(event,gesture)=>{
                if(gesture.dx>SWIPE_THRESHOLD){
                    console.log('Swipe right')
                    this.forceSwipeRight();
                }
                else if (gesture.dx<-SWIPE_THRESHOLD){
                    console.log('Swipe left');
                    this.forceSwipeLeft();
                }
                else{
                    this.resetPosition();
                }
               
            }
        });
        
        this.state={position};
    }
    forceSwipeLeft =()=>{
        Animated.timing(this.state.position,{
            toValue:{x:-SCREEN_WIDTH,y:0},
            duration:250
        }).start();
    }
    forceSwipeRight=()=>{
        Animated.timing(this.state.position,{
            toValue:{x:SCREEN_WIDTH,y:0},
            duration:250
        }).start();
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