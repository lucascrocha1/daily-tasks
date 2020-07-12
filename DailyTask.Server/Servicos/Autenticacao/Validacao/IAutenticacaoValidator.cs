namespace DailyTask.Server.Servicos.Autenticacao.Validacao
{
	using DailyTask.Server.Dto.Autenticacao;
	using System.Threading.Tasks;

	public interface IAutenticacaoValidator
	{
		Task ValidarAutenticar(AutenticarDto autenticarDto);
	}
}