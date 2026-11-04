package tecnm.equipo4.barberoApi.repositories;

import org.springframework.data.repository.CrudRepository;
import tecnm.equipo4.barberoApi.models.Barbero;

import java.util.List;
import java.util.Optional;

public interface BarberoRepository extends CrudRepository<Barbero, Long> {
    Optional<Barbero> findFirstByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
    List<Barbero> findBySucursal(String sucursal);
}
