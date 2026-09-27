# Conectar o CONG Mobile ao banco usado pelo Web

O aplicativo conversa com a API Express do CONG. A API valida o usuário pelo
Supabase Auth e acessa o PostgreSQL do mesmo projeto Supabase usado pelo Web.

1. Confirme no navegador que `https://dev.cong.com.br/api/health`
   responde com `status: ok`. Se o endereço público do Web mudou, use o novo.
2. Defina `EXPO_PUBLIC_API_URL` em `.env.development` com a origem pública do
   Web, **sem `/api` ao final**. O serviço mobile acrescenta `/api` às rotas.
3. Execute `npm install` e `npx expo start -c` dentro da pasta `cong-mobile`.
4. Entre com uma conta já confirmada pelo Web. Feche e reabra o aplicativo:
   a sessão deve ser restaurada. Em Perfil, toque em “Sair da conta” e reabra
   o aplicativo para conferir que o login voltou.
5. Para testar cadastro, use uma senha com pelo menos 10 caracteres e confirme
   o link recebido no e-mail. A confirmação usa o endereço público do Web.

O banco não deve ser acessado por uma conexão PostgreSQL dentro do celular.
Não coloque `DATABASE_URL` nem `SUPABASE_SECRET_KEY` em variáveis `EXPO_PUBLIC_`.

Se a API local for usada durante testes em celular físico, o servidor precisa
escutar a interface de rede, e o celular precisa alcançar o IP do computador.
O backend do ZIP escuta `127.0.0.1`; por isso, a URL hospedada é a configuração
indicada acima para testes fora do próprio computador.
