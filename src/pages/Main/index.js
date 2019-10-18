import React, { Component } from 'react';
import { keybord, ActivityIndicator, RefreshControl } from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-community/async-storage';

import api from '../../services/api';

import {
  Container,
  Form,
  SubmitButton,
  Input,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
  RemoveButton,
} from './styles';

export default class Main extends Component {
  static navigationOptions = {
    title: 'Users',
  };

  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    newUser: '',
    users: [],
    loading: false,
    isError: false,
  };

  async componentDidMount() {
    const users = await AsyncStorage.getItem('users');

    if (users) {
      this.setState({ users: JSON.parse(users) });
    }
  }

  componentDidUpdate(_, prevState) {
    const { users } = this.state;

    if (prevState.users !== users) {
      AsyncStorage.setItem('users', JSON.stringify(users));
    }
  }

  handleAddUser = async () => {
    const { users, newUser } = this.state;

    this.setState({ loading: true });

    try {
      const response = await api.get(`/users/${newUser}`);

      const data = {
        name: response.data.name,
        login: response.data.login,
        bio: response.data.bio,
        avatar: response.data.avatar_url,
      };

      this.setState({
        users: [...users, data],
        newUser: '',
        loading: false,
        isError: false,
      });
    } catch (e) {
      console.tron.log(e);
      this.setState({ loading: false, isError: true });
    }
    keybord.dismiss();
  };

  handleNavigation = user => {
    const { navigation } = this.props;

    navigation.navigate('User', { user });
  };

  refreshList = async () => {
    const { users } = this.state;
    const newUsers = [];

    this.setState({ refreshing: true });

    const promises = users.map(async user => {
      const { login } = user;
      const response = await api.get(`/users/${login}`);

      const data = {
        name: response.data.name,
        login: response.data.login,
        bio: response.data.bio,
        avatar: response.data.avatar_url,
      };

      newUsers.push(data);
    });

    await Promise.all(promises);

    this.setState({ users: newUsers, refreshing: false, isError: false });
  };

  handleRemove = async ({ name }) => {
    const { users } = this.state;

    console.tron.log(name);

    const newUsers = await users.filter(user => {
      return user.name !== name;
    });

    console.tron.log(newUsers);

    this.setState({ users: newUsers });
  };

  render() {
    const { users, newUser, loading, refreshing, isError } = this.state;

    return (
      <Container>
        <Form>
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Add user"
            value={newUser}
            onChangeText={text => this.setState({ newUser: text })}
            returnKeyType="send"
            onSubmitEditing={this.handleAddUser}
            error={isError}
          />
          <SubmitButton onPress={this.handleAddUser} isloading={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Icon name="add" size={20} color="#fff" />
            )}
          </SubmitButton>
        </Form>

        <List
          data={users}
          keyExtractor={user => user.login}
          refreshControl={
            <RefreshControl
              onRefresh={this.refreshList}
              refreshing={refreshing}
            />
          }
          renderItem={({ item }) => (
            <User>
              <RemoveButton onPress={() => this.handleRemove(item)}>
                <Icon name="delete" size={20} color="#BBB" />
              </RemoveButton>
              <Avatar source={{ uri: item.avatar }} />
              <Name>{item.name}</Name>
              <Bio>{item.bio}</Bio>
              <ProfileButton onPress={() => this.handleNavigation(item)}>
                <ProfileButtonText>View profile</ProfileButtonText>
              </ProfileButton>
            </User>
          )}
        />
      </Container>
    );
  }
}
