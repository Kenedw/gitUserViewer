import React, { Component } from 'react';
import PropType from 'prop-types';
import { ActivityIndicator } from 'react-native';

import api from '../../services/api';
import {
  Container,
  Header,
  Avatar,
  Name,
  Bio,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  Indicator,
  TextIndicator,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropType.shape({
      getParam: PropType.func,
      navigate: PropType.func,
    }).isRequired,
  };

  state = {
    stars: [],
    page: 2,
    refreshing: false,
  };

  async componentDidMount() {
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({ stars: response.data });
  }

  loadMore = async () => {
    const { page, stars } = this.state;
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred?page=${page}`);

    if (response.data.length) {
      this.setState({
        stars: [...stars, ...response.data],
        page: page + 1,
      });
    }
  };

  refreshList = async () => {
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    this.setState({ refreshing: true });

    const response = await api.get(`/users/${user.login}/starred`);

    this.setState({ stars: response.data, refreshing: false, page: 2 });
  };

  handleNavigation = item => {
    const { navigation } = this.props;
    const { html_url: url } = item;

    navigation.navigate('Webview', { url, title: 'GitHub' });
  };

  render() {
    const { navigation } = this.props;
    const { stars, refreshing } = this.state;

    const user = navigation.getParam('user');

    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio}</Bio>
        </Header>
        {stars.length ? (
          <Stars
            data={stars}
            keyExtrator={star => String(star.id)}
            onEndReachedThreshold={0.4} // Carrega mais itens quando chegar em 40% do fim
            onEndReached={this.loadMore} // Função que carrega mais itens
            onRefresh={this.refreshList} // Função dispara quando o usuário arrasta a lista pra baixo
            refreshing={refreshing} // Variável que armazena um estado true/false que representa se a lista está atualizando
            renderItem={({ item }) => (
              <Starred onPress={() => this.handleNavigation(item)}>
                <>
                  <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                  <Info>
                    <Title>{item.name}</Title>
                    <Author>{item.owner.login}</Author>
                  </Info>
                </>
              </Starred>
            )}
          />
        ) : (
          <Indicator>
            <ActivityIndicator size="large" color="#7159c1" />
            <TextIndicator> Loading...</TextIndicator>
          </Indicator>
        )}
      </Container>
    );
  }
}
