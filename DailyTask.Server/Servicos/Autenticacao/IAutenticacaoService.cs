namespace DailyTask.Server.Servicos.Autenticacao
{
	using DailyTask.Server.Dto.Autenticacao;
	using System.Threading.Tasks;

	public interface IAutenticacaoService
	{
		Task<bool> Autenticar(AutenticarDto autenticarDto);
	}
}