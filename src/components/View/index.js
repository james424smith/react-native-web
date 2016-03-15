import NativeMethodsDecorator from '../../modules/NativeMethodsDecorator'
import normalizeNativeEvent from '../../apis/PanResponder/normalizeNativeEvent'
import CoreComponent from '../CoreComponent'
import React, { Component, PropTypes } from 'react'
import StyleSheet from '../../apis/StyleSheet'
import StyleSheetPropType from '../../apis/StyleSheet/StyleSheetPropType'
import ViewStylePropTypes from './ViewStylePropTypes'

@NativeMethodsDecorator
class View extends Component {
  static propTypes = {
    accessibilityLabel: CoreComponent.propTypes.accessibilityLabel,
    accessibilityLiveRegion: CoreComponent.propTypes.accessibilityLiveRegion,
    accessibilityRole: CoreComponent.propTypes.accessibilityRole,
    accessible: CoreComponent.propTypes.accessible,
    children: PropTypes.any,
    onClick: PropTypes.func,
    onClickCapture: PropTypes.func,
    onMoveShouldSetResponder: PropTypes.func,
    onMoveShouldSetResponderCapture: PropTypes.func,
    onResponderGrant: PropTypes.func,
    onResponderMove: PropTypes.func,
    onResponderReject: PropTypes.func,
    onResponderRelease: PropTypes.func,
    onResponderTerminate: PropTypes.func,
    onResponderTerminationRequest: PropTypes.func,
    onStartShouldSetResponder: PropTypes.func,
    onStartShouldSetResponderCapture: PropTypes.func,
    onTouchCancel: PropTypes.func,
    onTouchCancelCapture: PropTypes.func,
    onTouchEnd: PropTypes.func,
    onTouchEndCapture: PropTypes.func,
    onTouchMove: PropTypes.func,
    onTouchMoveCapture: PropTypes.func,
    onTouchStart: PropTypes.func,
    onTouchStartCapture: PropTypes.func,
    pointerEvents: PropTypes.oneOf(['auto', 'box-none', 'box-only', 'none']),
    style: StyleSheetPropType(ViewStylePropTypes),
    testID: CoreComponent.propTypes.testID
  };

  static defaultProps = {
    accessible: true
  };

  constructor(props, context) {
    super(props, context)
    this._normalizeEventForHandler = this._normalizeEventForHandler.bind(this)
  }

  render() {
    const {
      pointerEvents,
      style,
      ...other
    } = this.props

    const pointerEventsStyle = pointerEvents && { pointerEvents }

    return (
      <CoreComponent
        {...other}
        onClick={this._handleClick}
        onClickCapture={this._normalizeEventForHandler('onClickCapture')}
        onTouchCancel={this._normalizeEventForHandler('onTouchCancel')}
        onTouchCancelCapture={this._normalizeEventForHandler('onTouchCancelCapture')}
        onTouchEnd={this._normalizeEventForHandler('onTouchEnd')}
        onTouchEndCapture={this._normalizeEventForHandler('onTouchEndCapture')}
        onTouchMove={this._normalizeEventForHandler('onTouchMove')}
        onTouchMoveCapture={this._normalizeEventForHandler('onTouchMoveCapture')}
        onTouchStart={this._normalizeEventForHandler('onTouchStart')}
        onTouchStartCapture={this._normalizeEventForHandler('onTouchStartCapture')}
        style={[
          styles.initial,
          style,
          pointerEventsStyle
        ]}
      />
    )
  }

  /**
   * React Native expects `pageX` and `pageY` to be on the `nativeEvent`, but
   * React doesn't include them for touch events.
   */
  _normalizeEventForHandler(handler) {
    return (e) => {
      const { pageX } = e.nativeEvent
      if (pageX === undefined) {
        e.nativeEvent = normalizeNativeEvent(e.nativeEvent)
      }
      this.props[handler] && this.props[handler](e)
    }
  }
}

const styles = StyleSheet.create({
  // https://github.com/facebook/css-layout#default-values
  initial: {
    alignItems: 'stretch',
    borderWidth: 0,
    borderStyle: 'solid',
    boxSizing: 'border-box',
    display: 'flex',
    flexBasis: 'auto',
    flexDirection: 'column',
    flexShrink: 0,
    margin: 0,
    padding: 0,
    position: 'relative',
    // button and anchor reset
    backgroundColor: 'transparent',
    color: 'inherit',
    font: 'inherit',
    textAlign: 'inherit',
    textDecoration: 'none',
    // list reset
    listStyle: 'none',
    // fix flexbox bugs
    maxWidth: '100%',
    minHeight: 0,
    minWidth: 0
  }
})

module.exports = View
