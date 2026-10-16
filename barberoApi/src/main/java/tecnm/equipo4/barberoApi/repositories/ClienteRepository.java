package tecnm.equipo4.barberoApi.repositories;

import org.springframework.data.repository.CrudRepository;
import tecnm.equipo4.barberoApi.models.Cliente;

public interface ClienteRepository extends CrudRepository<Cliente, Long> {
}
