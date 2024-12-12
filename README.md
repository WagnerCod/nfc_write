# NFC App Documentation

## Sobre o Aplicativo

Este aplicativo utiliza o plugin NFC para leitura, gravação, formatação e confirmação de dados em tags NFC. A aplicação foi desenvolvida utilizando Ionic e Cordova, e integra o plugin `@red-mobile/cordova-plugin-nfc` para manipular tags NFC de maneira eficiente.

### Funcionalidades Principais

1. **Gravar Dados em Tags NFC:**
   - Permite ao usuário cadastrar informações personalizadas em tags NFC.

2. **Ler Dados de Tags NFC:**
   - Após gravar os dados, o aplicativo realiza a leitura para confirmar a gravação bem-sucedida.

3. **Formatar Tags NFC:**
   - Caso os dados estejam incorretos, o usuário pode optar por apagar os dados da tag e refazer o processo de gravação.

4. **Gerenciamento de Listeners:**
   - Listeners são gerenciados dinamicamente para evitar conflitos e garantir o funcionamento correto do app.

## Tecnologias Utilizadas

- **Ionic Framework**
- **Cordova**
- **Plugin NFC:** `@red-mobile/cordova-plugin-nfc`

## Como Configurar e Rodar o Projeto

### Pré-requisitos

1. Node.js instalado (versão 14 ou superior recomendada).
2. Ionic CLI e Cordova instalados globalmente:

   ```bash
   npm install -g @ionic/cli cordova
   ```

3. Um dispositivo Android ou emulador com suporte NFC.

### Instalação do Plugin NFC

1. Instale o pacote NPM do plugin NFC:

   ```bash
   npm install @red-mobile/cordova-plugin-nfc
   ```

2. Adicione o plugin ao projeto Cordova:

   ```bash
   cordova plugin add @red-mobile/cordova-plugin-nfc
   ```

### Passos para Rodar o Projeto

1. Clone o repositório do projeto:

   ```bash
   git clone <URL_DO_REPOSITORIO>
   ```

2. Navegue para o diretório do projeto:

   ```bash
   cd <NOME_DO_DIRETORIO>
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

4. Adicione a plataforma Android:

   ```bash
   ionic cordova platform add android
   ```

5. Construa e execute o aplicativo:

   ```bash
   ionic cordova run android --device
   ```

   > **Nota:** Certifique-se de que um dispositivo Android está conectado via USB e o modo de depuração está habilitado.

## Estrutura do Código

### Principais Componentes

1. **Página Home:**
   - Permite que o usuário insira os dados que deseja gravar na tag NFC.

2. **Modal de Cadastro NFC:**
   - Processa a gravação, leitura e formatação das tags NFC.

3. **Serviço NFC:**
   - Centraliza a lógica de gerenciamento dos listeners NFC e operações como escrita, leitura e formatação.

### Funções Importantes

- **Gravação de Dados:** Utiliza o método `nfc.write` para gravar informações personalizadas na tag.

- **Leitura de Dados:** Utiliza `nfc.addNdefListener` para ler os dados gravados e confirmar a operação.

- **Formatação:** Utiliza `nfc.erase` para apagar os dados e formatar a tag NFC.

- **Gerenciamento de Listeners:** Remove listeners antigos antes de adicionar novos, utilizando `nfc.removeNdefListener`.

## Referências do Plugin NFC

O plugin utilizado é o `@red-mobile/cordova-plugin-nfc`. Ele oferece suporte às principais operações NFC, como:

1. Leitura de mensagens NDEF.
2. Gravação de mensagens NDEF.
3. Apagamento e formatação de tags.

Para mais informações sobre o plugin, veja a documentação: [cordova-plugin-nfc](https://www.npmjs.com/package/@red-mobile/cordova-plugin-nfc#nfcwrite)

## Contribuições

Sinta-se à vontade para abrir issues ou pull requests no repositório para melhorar o aplicativo ou corrigir problemas.
