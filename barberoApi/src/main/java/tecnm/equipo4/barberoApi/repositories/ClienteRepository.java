package tecnm.equipo4.barberoApi.repositories;

import org.springframework.data.repository.CrudRepository;
import tecnm.equipo4.barberoApi.models.Cliente;

import java.util.Optional;

public interface ClienteRepository extends CrudRepository<Cliente, Long> {
    Optional<Cliente> findFirstByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
}
